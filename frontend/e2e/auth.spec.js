import { test, expect } from '@playwright/test';

test.describe('Authentication and Dashboard E2E', () => {
    test('should allow user to register and verify dashboard loads', async ({ page }) => {
        const timestamp = Date.now();
        const testEmail = `tester_${timestamp}@example.com`;
        const testUsername = `tester_${timestamp}`;
        const testPassword = 'Password123@';

        // 1. Navigate to register directly
        await page.goto('/register');

        // Wait for page load
        await expect(page.locator('text=Create Your Account').first()).toBeVisible({ timeout: 10000 });

        // Step 1: Basic Info
        await page.fill('input[name="firstName"]', 'Playwright');
        await page.fill('input[name="lastName"]', 'Tester');

        // (Role defaults to USER, so we just click Next)
        await page.click('button:has-text("Next")');

        // Step 2: Account Setup (wait for the username field to slide in)
        await expect(page.locator('input[name="username"]').first()).toBeVisible({ timeout: 5000 });
        await page.fill('input[name="username"]', testUsername);
        await page.fill('input[name="email"]', testEmail);
        await page.fill('input[name="password"]', testPassword);
        await page.fill('input[name="confirmPassword"]', testPassword);
        await page.click('button:has-text("Next")');

        // Step 3: Financial Profile (wait for income fields)
        await expect(page.locator('input[name="monthlyIncome"]').first()).toBeVisible({ timeout: 5000 });
        await page.fill('input[name="monthlyIncome"]', '5000');
        await page.fill('input[name="savingsTarget"]', '1000');

        // Submit Registration completely
        await page.click('button:has-text("Create Account")');

        // 4. Verify Dashboard renders
        await page.waitForURL('**/dashboard', { timeout: 15000 });
        await expect(page.locator('text=Dashboard').first()).toBeVisible({ timeout: 15000 });
    });
});
