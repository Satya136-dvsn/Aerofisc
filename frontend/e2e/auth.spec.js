import { test, expect } from '@playwright/test';

test.describe('Authentication and Dashboard E2E', () => {
    test('should allow user to register, login, and verify dashboard loads', async ({ page }) => {
        const timestamp = Date.now();
        const testEmail = `tester_${timestamp}@example.com`;
        const testUsername = `tester_${timestamp}`;
        const testPassword = 'Password123@';

        // 1. Navigate to login
        await page.goto('/login');

        // Check if the login page loaded
        await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

        // 2. Switch to Register
        await page.getByRole('link', { name: 'Sign Up' }).click();

        // 3. Fill registration details
        await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
        await page.fill('input[name="firstName"]', 'Playwright');
        await page.fill('input[name="lastName"]', 'Tester');
        await page.fill('input[name="username"]', testUsername);
        await page.fill('input[name="email"]', testEmail);
        await page.fill('input[name="password"]', testPassword);
        await page.fill('input[name="confirmPassword"]', testPassword);

        // Select Role (Material UI Select)
        await page.locator('#role-label').click(); // click the label to open dropdown
        await page.getByRole('option', { name: 'User' }).click();

        // 4. Submit Registration
        await page.getByRole('button', { name: 'Sign Up' }).click();

        // Wait for redirect to login
        await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible({ timeout: 15000 });

        // 5. Fill Login details
        await page.fill('input[name="email"]', testEmail);
        await page.fill('input[name="password"]', testPassword);

        // 6. Login
        await page.getByRole('button', { name: 'Sign In' }).click();

        // 7. Verify Dashboard
        await page.waitForURL('**/dashboard', { timeout: 15000 });

        // Expect some dashboard elements to be visible
        await expect(page.locator('text=Balance')).toBeVisible({ timeout: 15000 });
    });
});
