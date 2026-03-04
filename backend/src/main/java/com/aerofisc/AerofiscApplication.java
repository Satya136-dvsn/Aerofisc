/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.aerofisc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AerofiscApplication {

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("   AEROFISC - Proprietary Personal Finance Engine");
        System.out.println("   Copyright (c) 2026 VenkataSatyanarayana Duba");
        System.out.println("   All Rights Reserved");
        System.out.println("==================================================");

        SpringApplication app = new SpringApplication(AerofiscApplication.class);

        // DEV_MODE Architecture Logic
        String devMode = System.getenv("DEV_MODE");
        String useRealDb = System.getenv("USE_REAL_DB");

        if ("true".equalsIgnoreCase(devMode) && !"true".equalsIgnoreCase(useRealDb)) {
            System.out.println(
                    "⚠️ STRICT TESTING DEV_MODE ENABLED ⚠️ - Bypassing PostgreSQL, initializing H2 Database mock layer.");
            app.setAdditionalProfiles("dev");
        }

        app.run(args);
    }
}
