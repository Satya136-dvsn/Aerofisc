/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
 */

package com.aerofisc.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitFilter.class);

    private final Map<String, RateLimitInfo> rateLimitMap = new ConcurrentHashMap<>();

    private static final int MAX_REQUESTS_PER_MINUTE = 5;
    private static final long WINDOW_MS = 60_000L;

    // Endpoints to rate-limit
    private static final List<String> RATE_LIMITED_PATHS = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/forgot-password",
            "/api/auth/reset-password",
            "/api/auth/verify-mfa"
    );

    @org.springframework.beans.factory.annotation.Value("${app.ratelimit.enabled:true}")
    private boolean rateLimitEnabled;

    private ScheduledExecutorService cleanupScheduler;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (!rateLimitEnabled) {
            chain.doFilter(request, response);
            return;
        }

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String requestURI = httpRequest.getRequestURI();

        boolean shouldLimit = RATE_LIMITED_PATHS.stream().anyMatch(requestURI::startsWith);

        if (shouldLimit) {
            String clientIP = getClientIP(httpRequest);

            if (isRateLimited(clientIP)) {
                logger.warn("Rate limit exceeded for IP: {}", clientIP);
                httpResponse.setStatus(429);
                httpResponse.setContentType("application/json");
                httpResponse.setHeader("Retry-After", "60");
                httpResponse.getWriter().write("{\"message\":\"Too many requests. Please try again later.\"}");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    private boolean isRateLimited(String clientIP) {
        long currentTime = System.currentTimeMillis();

        RateLimitInfo info = rateLimitMap.compute(clientIP, (key, existing) -> {
            if (existing == null || currentTime - existing.timestamp > WINDOW_MS) {
                return new RateLimitInfo(currentTime, 1);
            } else {
                existing.count.incrementAndGet();
                return existing;
            }
        });

        return info.count.get() > MAX_REQUESTS_PER_MINUTE;
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Use a daemon ScheduledExecutorService instead of a raw Thread
        cleanupScheduler = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "rate-limit-cleanup");
            t.setDaemon(true);
            return t;
        });

        cleanupScheduler.scheduleAtFixedRate(() -> {
            long currentTime = System.currentTimeMillis();
            rateLimitMap.entrySet()
                    .removeIf(entry -> currentTime - entry.getValue().timestamp > WINDOW_MS);
        }, WINDOW_MS, WINDOW_MS, TimeUnit.MILLISECONDS);
    }

    @Override
    public void destroy() {
        if (cleanupScheduler != null) {
            cleanupScheduler.shutdownNow();
        }
        rateLimitMap.clear();
    }

    private static class RateLimitInfo {
        private final long timestamp;
        private final AtomicInteger count;

        public RateLimitInfo(long timestamp, int count) {
            this.timestamp = timestamp;
            this.count = new AtomicInteger(count);
        }
    }
}
