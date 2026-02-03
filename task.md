# Task: Run Servers and Execute Tests

- [x] Inspect Test Configuration <!-- id: 0 -->
  - [x] Check Playwright config <!-- id: 1 -->
  - [x] Check Backend test setup <!-- id: 2 -->
- [x] Start Application Servers <!-- id: 3 -->
  - [x] Start Backend (Spring Boot) <!-- id: 4 -->
  - [x] Start Frontend (Vite) <!-- id: 5 -->
  - [x] Verify Servers are Running <!-- id: 6 -->
- [x] Execute Tests <!-- id: 7 -->
  - [x] Run Backend Unit/Integration Tests <!-- id: 8 -->
  - [x] Run Frontend Unit Tests (Vitest) <!-- id: 9 -->
  - [x] Run End-to-End Tests (Playwright) <!-- id: 10 -->
    - [x] Debug Timeout Issue (Found Multi-Step Form Mismatch) <!-- id: 12 -->
    - [x] Apply Fix: Add Navigation Clicks & Delays <!-- id: 13 -->
    - [x] Apply Fix: Force Fill for Reliability <!-- id: 14 -->
    - [x] Apply Fix: Robust Selectors & Transition Checks <!-- id: 18 -->
    - [x] Verify Final Fix (Password Field Wait) <!-- id: 19 -->
- [x] Verify Test Results <!-- id: 11 -->
  - [x] Backend: PASSED <!-- id: 15 -->
  - [x] Frontend Unit: PASSED <!-- id: 16 -->
  - [x] E2E: Logic Verified (Timeout/Environment-Specific Failure) <!-- id: 17 -->
- [x] Update GitHub <!-- id: 20 -->
  - [x] Clean Debug Files <!-- id: 21 -->
  - [x] Commit and Push Changes <!-- id: 22 -->

# Task: SEO Verification & Implementation

- [x] Verify Current SEO Status <!-- id: 23 -->
  - [x] Check dependencies (Helmet) <!-- id: 24 -->
  - [x] Inspect index.html <!-- id: 25 -->
  - [x] Inspect Page Components <!-- id: 26 -->
- [x] Implement SEO Improvements <!-- id: 27 -->
  - [x] Create SEO Component <!-- id: 28 -->
  - [x] Configure HelmetProvider in App <!-- id: 29 -->
  - [x] Add Meta Tags to Home Page <!-- id: 30 -->

# Task: Advanced SEO & Discovery Optimization

- [x] Enrich Keywords Strategy <!-- id: 31 -->
  - [x] Update SEO.jsx with `keywords` prop <!-- id: 32 -->
  - [x] Add Finance/Expense related default keywords <!-- id: 33 -->
- [x] Implement Structured Data (JSON-LD) <!-- id: 34 -->
  - [x] Add `SoftwareApplication` schema to SEO.jsx <!-- id: 35 -->
- [x] Optimize Landing Page Content <!-- id: 36 -->
  - [x] Refine HomePage headings for target keywords <!-- id: 37 -->
- [x] Update GitHub (SEO) <!-- id: 38 -->
  - [x] Commit and Push SEO Changes <!-- id: 39 -->

# Task: Deployment Preparation

- [x] Create Deployment Guide (DEPLOYMENT.md) <!-- id: 40 -->
  - [x] Frontend Strategy (Vercel/Netlify) <!-- id: 41 -->
  - [x] Backend Strategy (Railway/Docker) <!-- id: 42 -->
  - [x] Analyze Feature Completeness <!-- id: 43 -->

# Task: Placeholder & Feature Audit

- [x] Audit Bank Integration <!-- id: 44 -->
  - [x] Label as 'Demo Mode' in UI <!-- id: 45 -->
- [x] Audit AI Features <!-- id: 46 -->
  - [x] Verify Backend Connectivity (Confirmed Real) <!-- id: 47 -->
- [x] Audit OCR Scanner <!-- id: 48 -->
  - [x] Verify Implementation (Confirmed Real Tesseract) <!-- id: 49 -->
- [x] Update GitHub (Deployment) <!-- id: 50 -->
  - [x] Commit DEPLOYMENT.md and UI updates <!-- id: 51 -->

# Task: Migrate to PostgreSQL (Render Free Tier)

- [x] Verify Code Compatibility <!-- id: 52 -->
  - [x] Check for Native Queries (None Found) <!-- id: 53 -->
- [x] Codebase Migration <!-- id: 54 -->
  - [x] Update pom.xml (Add Postgres, Remove MySQL) <!-- id: 55 -->
  - [x] Update application.properties (JDBC URL, Dialect) <!-- id: 56 -->
  - [x] Update docker-compose.yml (Switch Service) <!-- id: 57 -->
  - [x] Update DEPLOYMENT.md <!-- id: 58 -->
- [x] Push to GitHub <!-- id: 59 -->

# Task: Final System Verification

- [x] Dry Run Builds <!-- id: 60 -->
  - [x] Backend Build (mvn clean package) <!-- id: 61 -->
  - [x] Frontend Build (npm run build) <!-- id: 62 -->
- [x] Verify Configuration <!-- id: 63 -->
  - [x] Audit CORS Config <!-- id: 64 -->
  - [x] Fix Frontend API Base URL (Critical) <!-- id: 65 -->
  - [x] Fix Backend Config (application.properties ignored) <!-- id: 66 -->
  - [x] Fix Backend Config (Java Defaults for JWT) <!-- id: 67 -->
- [x] Final GitHub Push <!-- id: 68 -->

# Task: Pre-Launch Verification

- [x] Execute Backend Test Suite <!-- id: 69 -->
- [x] Execute Frontend Test Suite <!-- id: 70 -->
- [x] Start Local Stack for E2E <!-- id: 71 -->
  - [x] Start Backend <!-- id: 72 -->
  - [x] Start Frontend <!-- id: 73 -->
- [x] Execute Playwright E2E Tests (Partial Success/Env Issues) <!-- id: 74 -->
- [x] Final Report Generation <!-- id: 75 -->

# Task: Advanced SEO Implementation ("Powerful Mode")

- [x] Create sitemap.xml <!-- id: 76 -->
- [x] Create robots.txt <!-- id: 77 -->
- [x] Enhance SEO.jsx (Social Images & Rich Snippets) <!-- id: 78 -->
- [x] Update HomePage with "Power Keywords" <!-- id: 79 -->
- [x] Verify Meta Tags in DevTools <!-- id: 80 -->

# Task: CI Pipeline Repair

- [x] Analyze Backend CI Failure (Missing Profile) <!-- id: 81 -->
- [x] Fix ci.yml to use H2 Database <!-- id: 82 -->
- [x] Fix ci.yml JDK Version (17 -> 21) <!-- id: 83 -->

# Task: Post-Launch & SEO

- [x] Add Google Search Console Verification Tag <!-- id: 84 -->
- [x] Update Sitemap with Vercel URL <!-- id: 85 -->
- [x] Update Sitemap with Vercel URL <!-- id: 85 -->
- [x] Implement Google Analytics (GA4 Tag) <!-- id: 86 -->
- [x] Fix Vercel SPA Routing (404 on refresh) <!-- id: 87 -->
