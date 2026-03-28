// @ts-check
import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('Advanced Features & Integrations', () => {
    // Shared user credentials
    const user = {
        firstName: 'Test',
        lastName: 'User',
        username: `usr_${Date.now()}`,
        email: `test-${Date.now()}@example.com`,
        password: 'Password@123',
        confirmPassword: 'Password@123',
        monthlyIncome: '50000',
        savingsTarget: '10000'
    };

    test('Complete Feature Walkthrough', async ({ page, context }) => {
        // Increase timeout for this comprehensive integration test
        test.setTimeout(90000);

        // Disable Onboarding Tour persistently across all pages/navigations in this context
        await context.addInitScript(() => {
            window.localStorage.setItem('onboardingTourCompleted', 'true');
        });

        try {
            // 1. Register and Login
            console.log('Navigating to register...');
            await page.goto('/register');

            await expect(page.locator('text=Create Your Account').first()).toBeVisible({ timeout: 15000 });

            // Step 1: Basic Info
            console.log('Filling Step 1...');
            await page.fill('input[name="firstName"]', user.firstName);
            await page.fill('input[name="lastName"]', user.lastName);
            await page.click('button:has-text("Next")');

            // Step 2: Account Setup
            console.log('Filling Step 2...');
            await expect(page.locator('input[name="username"]').first()).toBeVisible({ timeout: 10000 });
            await page.fill('input[name="username"]', user.username);
            await page.fill('input[name="email"]', user.email);
            await page.fill('input[name="password"]', user.password);
            await page.fill('input[name="confirmPassword"]', user.confirmPassword);
            await page.click('button:has-text("Next")');

            // Step 3: Financial Profile
            console.log('Filling Step 3...');
            await expect(page.locator('input[name="monthlyIncome"]').first()).toBeVisible({ timeout: 10000 });
            await page.fill('input[name="monthlyIncome"]', user.monthlyIncome);
            await page.fill('input[name="savingsTarget"]', user.savingsTarget);

            console.log('Submitting registration...');
            await page.click('button:has-text("Create Account")');

            // 4. Verify Dashboard renders or handle auto-login vs redirect
            console.log('Waiting for navigation...');
            // In Aerofisc, successful registration auto-logs in and redirects to /dashboard
            await page.waitForURL('**/dashboard', { timeout: 20000 });
            await expect(page.locator('text=Dashboard').first()).toBeVisible({ timeout: 20000 });
            console.log('Successfully reached dashboard.');

            // 2. Test Multi-Currency & Bank Integration (Settings)
            console.log('Testing Settings...');
            await page.goto('/settings');

            // Click Preferences tab
            await page.click('button[role="tab"]:has-text("Preferences")');
            await expect(page.locator('text=Currency').first()).toBeVisible();
            console.log('Currency visible.');

            // Check Bank Integration
            await page.click('button[role="tab"]:has-text("Connected Banks")');
            await expect(page.locator('text=Bank Connections').first()).toBeVisible();
            await expect(page.locator('button:has-text("Connect Bank")').first()).toBeVisible();
            console.log('Bank tab checked.');

            // Open Connect Dialog
            await page.click('button:has-text("Connect Bank")');
            await expect(page.locator('text=Select your bank').first()).toBeVisible();
            await page.click('button:has-text("Cancel")');

            // 3. Test Budget Templates (Budgets)
            console.log('Testing Budgets...');
            await page.goto('/budgets');
            await expect(page.locator('button:has-text("Use Template")').first()).toBeVisible();
            await page.click('button:has-text("Use Template")');
            await expect(page.locator('text=Budget Templates').first()).toBeVisible();
            // Close specific to UI implementation (click outside or escape)
            await page.keyboard.press('Escape');
            console.log('Budgets checked.');

            // 4. Test Calendar Export (Bills)
            console.log('Testing Bills...');
            await page.goto('/bills');
            // Allow time for button to be visible even if disabled
            await expect(page.locator('button:has-text("Export to Calendar")').first()).toBeVisible({ timeout: 15000 });
            console.log('Bills checked.');

            // 5. Test OCR Scanner (Transactions -> Add Transaction)
            console.log('Testing OCR in Transactions...');
            await page.goto('/transactions');
            await page.click('button:has-text("Add Transaction")');

            await expect(page.locator('button:has-text("Scan Receipt (OCR)")').first()).toBeVisible();
            await page.click('button:has-text("Scan Receipt (OCR)")');
            await expect(page.locator('text=Scan Receipt').first()).toBeVisible();
            console.log('OCR checked.');

            console.log('All new features verified successfully!');
        } catch (e) {
            console.error('Test failed:', e);
            await page.screenshot({ path: 'test-failure.png' });
            throw e;
        }
    });
});
