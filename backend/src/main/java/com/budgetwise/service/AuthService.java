/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.annotation.Auditable;
import com.budgetwise.dto.*;
import com.budgetwise.entity.RefreshToken;
import com.budgetwise.entity.User;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.security.JwtTokenProvider;
import com.budgetwise.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final ProfileService profileService;
    private final NotificationService notificationService;
    private final RefreshTokenService refreshTokenService;
    private final MfaService mfaService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider,
            ProfileService profileService, NotificationService notificationService, MfaService mfaService,
            RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.profileService = profileService;
        this.notificationService = notificationService;
        this.mfaService = mfaService;
        this.refreshTokenService = refreshTokenService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email Address already in use!");
        }

        // Validate password strength
        com.budgetwise.util.PasswordValidator.ValidationResult validationResult = com.budgetwise.util.PasswordValidator
                .validate(request.getPassword());
        if (!validationResult.isValid()) {
            throw new RuntimeException(validationResult.getErrorMessage());
        }

        // Create new user
        User user = new User();

        String username = request.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = request.getEmail().split("@")[0];
            // Ensure username is unique
            if (userRepository.existsByUsername(username)) {
                username = username + "_" + System.currentTimeMillis() % 1000;
            }
        }

        user.setUsername(username);
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Set role from request or default to USER
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            user.setRole(User.Role.ADMIN);
        } else {
            user.setRole(User.Role.USER);
        }

        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        // Initialize user profile
        ProfileDto profileDto = new ProfileDto();
        profileDto.setFirstName(request.getFirstName());
        profileDto.setLastName(request.getLastName());
        profileDto.setMonthlyIncome(request.getMonthlyIncome());
        profileDto.setSavingsTarget(request.getSavingsTarget());

        profileService.initializeProfile(savedUser, profileDto);

        // Send Welcome Notification
        notificationService.createNotification(
                savedUser.getId(),
                "INFO",
                "Welcome to BudgetWise!",
                "Thanks for joining! Set up your budget and start tracking your expenses.");

        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate tokens
        String accessToken = tokenProvider.generateAccessToken(authentication);
        com.budgetwise.entity.RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser.getId());

        return new AuthResponse(accessToken, refreshToken.getToken(), tokenProvider.getJwtExpirationMs(),
                UserDto.fromEntity(savedUser));
    }

    @Auditable(action = "LOGIN")
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.generateAccessToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (Boolean.TRUE.equals(user.getIsMfaEnabled())) {
            AuthResponse response = new AuthResponse();
            response.setMfaRequired(true);
            response.setPreAuthToken(accessToken);
            return response;
        }

        // Create or update refresh token (upsert logic in service)
        com.budgetwise.entity.RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return new AuthResponse(accessToken, refreshToken.getToken(), tokenProvider.getJwtExpirationMs(),
                UserDto.fromEntity(user));
    }

    @Auditable(action = "MFA_VERIFY")
    public AuthResponse verifyMfa(String preAuthToken, int code) {
        if (!tokenProvider.validateToken(preAuthToken)) {
            throw new RuntimeException("Invalid pre-auth token");
        }

        Long userId = tokenProvider.getUserIdFromToken(preAuthToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!Boolean.TRUE.equals(user.getIsMfaEnabled())) {
            throw new RuntimeException("MFA is not enabled for this user");
        }

        // Verify the code
        if (!mfaService.verifyCode(user.getMfaSecret(), code)) {
            throw new RuntimeException("Invalid MFA code");
        }

        // Generate fresh tokens
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities());

        String newAccessToken = tokenProvider.generateAccessToken(authentication);

        // Create or update refresh token (upsert logic in service)
        com.budgetwise.entity.RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());

        return new AuthResponse(newAccessToken, newRefreshToken.getToken(), tokenProvider.getJwtExpirationMs(),
                UserDto.fromEntity(user));
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(oldToken -> {
                    // Rotate the refresh token
                    RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(oldToken);

                    User user = newRefreshToken.getUser();
                    UserPrincipal userPrincipal = UserPrincipal.create(user);
                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            userPrincipal, null, userPrincipal.getAuthorities());
                    String accessToken = tokenProvider.generateAccessToken(authentication);

                    return new AuthResponse(accessToken, newRefreshToken.getToken(), tokenProvider.getJwtExpirationMs(),
                            UserDto.fromEntity(user));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
}
