/* eslint-env node */
import { defineConfig, devices } from '@playwright/test';



const isWin = process.platform === "win32";
const mvnCmd = isWin ? "mvn.cmd" : "mvn";
const npmCmd = isWin ? "npm.cmd" : "npm";

export default defineConfig({
    testDir: '.',
    testMatch: '**/*.spec.js',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
    webServer: [
        {
            command: `${mvnCmd} spring-boot:run "-Dspring-boot.run.profiles=dev"`,
            cwd: '../backend',
            url: 'http://127.0.0.1:8080/actuator/health',
            timeout: 300 * 1000,
            reuseExistingServer: !process.env.CI,
            stdout: 'pipe',
            stderr: 'pipe',
        },
        {
            command: `${npmCmd} run dev`,
            cwd: '.',
            url: 'http://localhost:3000',
            timeout: 120 * 1000,
            reuseExistingServer: !process.env.CI,
        }
    ],
});
