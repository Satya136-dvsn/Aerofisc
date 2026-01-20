// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Advanced Features & Integrations', () => {
    // Shared user credentials
    const user = {
        firstName: 'Test',
        lastName: 'User',
        email: `test-${Date.now()}@example.com`,
        password: 'Password@123',
        confirmPassword: 'Password@123',
        monthlyIncome: '50000',
        savingsTarget: '10000'
    };

    test('Complete Feature Walkthrough', async ({ page }) => {
        try {
            // 1. Register and Login
            console.log('Navigating to register...');
            await page.goto('/register');
            await page.fill('input[name="firstName"]', user.firstName);
            await page.fill('input[name="lastName"]', user.lastName);
            await page.fill('input[name="email"]', user.email);
            await page.fill('input[name="password"]', user.password);
            await page.fill('input[name="confirmPassword"]', user.confirmPassword);

            console.log('Filling extra fields...');
            const incomeInput = page.locator('input[name="monthlyIncome"]');
            if (await incomeInput.isVisible()) {
                await incomeInput.fill(user.monthlyIncome);
            }
            const savingsInput = page.locator('input[name="savingsTarget"]');
            if (await savingsInput.isVisible()) {
                await savingsInput.fill(user.savingsTarget);
            }

            console.log('Submitting registration...');
            await page.click('button[type="submit"]');

            console.log('Waiting for navigation...');
            await page.waitForTimeout(3000); // Give time for redirect
            const url = page.url();
            console.log('Current URL:', url);

            if (url.includes('login')) {
                console.log('Redirected to login. Logging in...');
                await page.fill('input[name="email"]', user.email);
                await page.fill('input[name="password"]', user.password);
                await page.click('button[type="submit"]');
                await page.waitForURL('**/dashboard');
            } else if (url.includes('dashboard')) {
                console.log('On dashboard.');
            } else {
                console.log('Unexpected state. Taking screenshot.');
                await expect(page).toHaveURL(/.*dashboard/);
            }

            // 2. Test Multi-Currency & Bank Integration (Settings)
            console.log('Testing Settings...');
            await page.goto('/settings');

            // Click Preferences tab
            await page.getByRole('tab', { name: 'Preferences' }).click();
            await expect(page.getByLabel('Currency')).toBeVisible();
            console.log('Currency visible.');

            // Check Bank Integration
            await page.getByRole('tab', { name: 'Connected Banks' }).click();
            await expect(page.getByText('Bank Connections')).toBeVisible();
            await expect(page.getByRole('button', { name: 'Connect Bank' })).toBeVisible();
            console.log('Bank tab checked.');

            // Open Connect Dialog
            await page.getByRole('button', { name: 'Connect Bank' }).click();
            await expect(page.getByText('Select your bank')).toBeVisible();
            await page.getByRole('button', { name: 'Cancel' }).click();

            // 3. Test Budget Templates (Budgets)
            console.log('Testing Budgets...');
            await page.goto('/budgets');
            await expect(page.getByRole('button', { name: 'Use Template' })).toBeVisible();
            await page.getByRole('button', { name: 'Use Template' }).click();
            await expect(page.getByText('Budget Templates')).toBeVisible();
            // Close specific to UI implementation (click outside or escape)
            await page.keyboard.press('Escape');
            console.log('Budgets checked.');

            // 4. Test Calendar Export (Bills)
            console.log('Testing Bills...');
            await page.goto('/bills');
            await expect(page.getByRole('button', { name: 'Export to Calendar' })).toBeVisible();
            console.log('Bills checked.');

            // 5. Test OCR Scanner (Dashboard -> Add Transaction)
            console.log('Testing OCR in Dashboard...');
            await page.goto('/dashboard');
            await page.getByRole('button', { name: 'Add Transaction' }).click();

            await expect(page.getByRole('button', { name: 'Scan Receipt (OCR)' })).toBeVisible();
            await page.getByRole('button', { name: 'Scan Receipt (OCR)' }).click();
            await expect(page.getByText('Scan Receipt')).toBeVisible();
            console.log('OCR checked.');

            console.log('All new features verified successfully!');
        } catch (e) {
            console.error('Test failed:', e);
            await page.screenshot({ path: 'test-failure.png' });
            throw e;
        }
    });
});
