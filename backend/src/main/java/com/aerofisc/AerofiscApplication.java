/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.aerofisc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AerofiscApplication {

    private static final Logger logger = LoggerFactory.getLogger(AerofiscApplication.class);

    public static void main(String[] args) {
        logger.info("==================================================");
        logger.info("   AEROFISC - Proprietary Personal Finance Engine");
        logger.info("   Copyright (c) 2026 VenkataSatyanarayana Duba");
        logger.info("   All Rights Reserved");
        logger.info("==================================================");

        SpringApplication app = new SpringApplication(AerofiscApplication.class);

        // DEV_MODE Architecture Logic
        String devMode = System.getenv("DEV_MODE");
        String useRealDb = System.getenv("USE_REAL_DB");

        if ("true".equalsIgnoreCase(devMode) && !"true".equalsIgnoreCase(useRealDb)) {
            logger.warn("STRICT TESTING DEV_MODE ENABLED - Bypassing PostgreSQL, initializing H2 Database mock layer.");
            app.setAdditionalProfiles("dev");
        }

        app.run(args);
    }
}
