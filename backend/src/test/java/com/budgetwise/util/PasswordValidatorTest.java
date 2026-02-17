/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("PasswordValidator Unit Tests")
class PasswordValidatorTest {

    @Test
    @DisplayName("Should accept strong password with all requirements")
    void validate_WithStrongPassword_ShouldBeValid() {
        // Arrange
        String password = "StrongPass123!";

        // Act
        PasswordValidator.ValidationResult result = PasswordValidator.validate(password);

        // Assert
        assertTrue(result.isValid());
        assertNull(result.getErrorMessage());
    }

    @Test
    @DisplayName("Should reject password shorter than 8 characters")
    void validate_WithShortPassword_ShouldBeInvalid() {
        // Arrange
        String password = "Ab1!";

        // Act
        PasswordValidator.ValidationResult result = PasswordValidator.validate(password);

        // Assert
        assertFalse(result.isValid());
        assertTrue(result.getErrorMessage().contains("8 characters"));
    }

    @Test
    @DisplayName("Should reject password without uppercase letter")
    void validate_WithoutUppercase_ShouldBeInvalid() {
        // Arrange
        String password = "lowercase123!";

        // Act
        PasswordValidator.ValidationResult result = PasswordValidator.validate(password);

        // Assert
        assertFalse(result.isValid());
        assertTrue(result.getErrorMessage().contains("uppercase"));
    }

    @Test
    @DisplayName("Should reject password without lowercase letter")
    void validate_WithoutLowercase_ShouldBeInvalid() {
        // Arrange
        String password = "UPPERCASE123!";

        // Act
        PasswordValidator.ValidationResult result = PasswordValidator.validate(password);

        // Assert
        assertFalse(result.isValid());
        assertTrue(result.getErrorMessage().contains("lowercase"));
    }

    @Test
    @DisplayName("Should reject password without digit")
    void validate_WithoutDigit_ShouldBeInvalid() {
        // Arrange
        String password = "NoDigitsHere!";

        // Act
        PasswordValidator.ValidationResult result = PasswordValidator.validate(password);

        // Assert
        assertFalse(result.isValid());
        assertTrue(result.getErrorMessage().contains("digit"));
    }

    @Test
    @DisplayName("Should reject password without special character")
    void validate_WithoutSpecialChar_ShouldBeInvalid() {
        // Arrange
        String password = "NoSpecial123";

        // Act
        PasswordValidator.ValidationResult result = PasswordValidator.validate(password);

        // Assert
        assertFalse(result.isValid());
        assertTrue(result.getErrorMessage().contains("special character"));
    }

    @ParameterizedTest
    @DisplayName("Should accept various strong passwords")
    @ValueSource(strings = {
            "Password123!",
            "MySecure@Pass1",
            "Test#Password99",
            "Complex!Pass123",
            "Str0ng_P@ssword"
    })
    void validate_WithVariousStrongPasswords_ShouldBeValid(String password) {
        // Act
        PasswordValidator.ValidationResult result = PasswordValidator.validate(password);

        // Assert
        assertTrue(result.isValid());
    }

    @ParameterizedTest
    @DisplayName("Should reject various weak passwords")
    @ValueSource(strings = {
            "password", // No uppercase, number, or special
            "PASSWORD123", // No lowercase or special
            "Pass123", // Too short, no special
            "12345678!", // No letters
            "" // Empty
    })
    void validate_WithVariousWeakPasswords_ShouldBeInvalid(String password) {
        // Act
        PasswordValidator.ValidationResult result = PasswordValidator.validate(password);

        // Assert
        assertFalse(result.isValid());
    }

    @Test
    @DisplayName("Should reject null password")
    void validate_WithNullPassword_ShouldBeInvalid() {
        // Act
        PasswordValidator.ValidationResult result = PasswordValidator.validate(null);

        // Assert
        assertFalse(result.isValid());
    }

    @Test
    @DisplayName("Should combine multiple error messages")
    void validate_WithMultipleErrors_ShouldListAllErrors() {
        // Arrange
        String password = "abc"; // Too short, no uppercase, no digit, no special

        // Act
        PasswordValidator.ValidationResult result = PasswordValidator.validate(password);

        // Assert
        assertFalse(result.isValid());
        String errorMessage = result.getErrorMessage();
        assertTrue(errorMessage.contains("8 characters"));
        assertTrue(errorMessage.contains("uppercase"));
        assertTrue(errorMessage.contains("digit"));
        assertTrue(errorMessage.contains("special"));
    }
}
