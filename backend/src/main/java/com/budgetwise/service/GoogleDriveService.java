/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.config.ExternalApiConfig;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.FileContent;
import com.google.api.client.http.InputStreamContent;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleDriveService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleDriveService.class);
    private static final String APPLICATION_NAME = "BudgetWise Tracker";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final List<String> SCOPES = Collections.singletonList(DriveScopes.DRIVE_FILE);
    private static final String TOKENS_DIRECTORY_PATH = "tokens";

    private final ExternalApiConfig apiConfig;
    private final NetHttpTransport httpTransport;

    public GoogleDriveService(ExternalApiConfig apiConfig) throws GeneralSecurityException, IOException {
        System.out.println("DEBUG: GoogleDriveService Initializing...");
        this.apiConfig = apiConfig;
        try {
            this.httpTransport = GoogleNetHttpTransport.newTrustedTransport();
            System.out.println("DEBUG: GoogleDriveService httpTransport created.");
        } catch (Exception e) {
            System.out.println("DEBUG: GoogleDriveService FAILED to create httpTransport: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private GoogleAuthorizationCodeFlow getFlow() throws IOException {
        GoogleClientSecrets.Details web = new GoogleClientSecrets.Details();
        web.setClientId(apiConfig.getGoogleDriveClientId());
        web.setClientSecret(apiConfig.getGoogleDriveClientSecret());
        GoogleClientSecrets clientSecrets = new GoogleClientSecrets();
        clientSecrets.setWeb(web);

        return new GoogleAuthorizationCodeFlow.Builder(
                httpTransport, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();
    }

    public String getAuthorizationUrl() throws IOException {
        return getFlow().newAuthorizationUrl()
                .setRedirectUri(apiConfig.getGoogleDriveRedirectUri())
                .build();
    }

    public void exchangeCodeForToken(String code, String userId) throws IOException {
        GoogleTokenResponse response = getFlow().newTokenRequest(code)
                .setRedirectUri(apiConfig.getGoogleDriveRedirectUri())
                .execute();
        getFlow().createAndStoreCredential(response, userId);
    }

    public String uploadBackup(byte[] data, String filename, String userId) throws IOException {
        Credential credential = getFlow().loadCredential(userId);
        if (credential == null) {
            throw new IOException("User not authenticated with Google Drive");
        }

        // Refresh token if expired
        if (credential.getExpiresInSeconds() != null && credential.getExpiresInSeconds() < 60) {
            credential.refreshToken();
        }

        Drive service = new Drive.Builder(httpTransport, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();

        File fileMetadata = new File();
        fileMetadata.setName(filename);

        InputStreamContent mediaContent = new InputStreamContent("application/json", new ByteArrayInputStream(data));

        File file = service.files().create(fileMetadata, mediaContent)
                .setFields("id, webViewLink")
                .execute();

        logger.info("Backup uploaded to Google Drive. File ID: {}", file.getId());
        return "Backup uploaded successfully. Link: " + file.getWebViewLink();
    }

    public boolean isUserAuthenticated(String userId) throws IOException {
        return getFlow().loadCredential(userId) != null;
    }
}
