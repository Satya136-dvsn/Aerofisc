/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.Aerofisc;

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
        SpringApplication.run(AerofiscApplication.class, args);
    }
}

