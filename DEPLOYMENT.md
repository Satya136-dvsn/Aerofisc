# Deployment Guide for BudgetWise

## 1. Where to Deploy?

This is a **Full-Stack Application** with two distinct parts. They need to be hosted separately or via Docker.

### Recommended Strategy (Free/Low Cost)

* **Frontend (React)**: **Vercel** or **Netlify** (Best for Vite apps).
* **Backend (Spring Boot)**: **Render** (as a Web Service) or **Railway** (Trial).
* **Database (PostgreSQL)**: **Supabase** (Best Free Tier) or **Neon.tech**.

---

## 2. Deployment Steps (Follow Exact Order)

**Order is critical:**

1. **Supabase** (Create DB first so you have the password).
2. **Render** (Deploy Backend next, connecting it to Supabase).
3. **Vercel** (Deploy Frontend last, connecting it to Render).

### A. Deploy Frontend to Vercel

1. Push your code to GitHub (Done).
2. Log in to Vercel -> "Add New Project".
3. Import the `budgetwise-tracker` repository.
4. **Configuration**:
    * **Root Directory**: `frontend` (Important! Check this box).
    * **Framework Preset**: Vite.
    * **Build Command**: `npm run build`.
    * **Output Directory**: `dist`.
5. **Environment Variables**:
    * `VITE_API_BASE_URL`: The URL of your deployed backend (e.g., `https://budgetwise-backend.onrender.com`).

### B. Deploy Backend to Render (Web Service) & Database to Supabase

1. **Create Database on Supabase**:
    * Log in to Supabase -> "New Project".
    * Save your **Database Password** safely!
    * Go to Project Settings -> Database -> Connection String -> **JDBC**.
    * Copy the connection string. It will look like: `jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:6543/postgres...`

2. **Deploy Backend to Render**:
    * Log in to Render -> "New" -> "Web Service".
    * Connect your GitHub repo.
    * **Runtime**: Java.
    * **Build Command**: `mvn clean package -DskipTests` (Render usually detects this).
    * **Start Command**: `java -jar target/budgetwise-0.0.1-SNAPSHOT.jar`.
    * **Select "Free" Instance Type**.

3. **Environment Variables (in Render Dashboard)**:
    * `SPRING_PROFILES_ACTIVE`: `prod`
    * `SPRING_DATASOURCE_URL`: Paste the **JDBC Connection String** from Supabase.
4. **Create Database on Supabase**:
    * Log in to Supabase -> "New Project".
    * Save your **Database Password** safely!
    * Go to Project Settings -> Database -> Connection String -> **JDBC**.
    * Copy the connection string. It will look like: `jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:6543/postgres...`

5. **Deploy Backend to Render**:
    * Log in to Render -> "New" -> "Web Service".
    * Connect your GitHub repo.
    * **Runtime**: Java.
    * **Build Command**: `mvn clean package -DskipTests` (Render usually detects this).
    * **Start Command**: `java -jar target/budgetwise-0.0.1-SNAPSHOT.jar`.
    * **Select "Free" Instance Type**.

6. **Environment Variables (in Render Dashboard)**:
    * `SPRING_PROFILES_ACTIVE`: `prod`
    * `SPRING_DATASOURCE_URL`: Paste the **JDBC Connection String** from Supabase.
        * *Tip: Ensure you add `?sslmode=require` to the end of the URL if not present.*
    * `SPRING_DATASOURCE_USERNAME`: `postgres` (or as shown in Supabase).
    * `SPRING_DATASOURCE_PASSWORD`: [Your Supabase Password].
    * `JWT_SECRET`: [Generate a strong random string].
    * `CORS_ALLOWED_ORIGINS`: [Your Vercel Frontend URL] (Add this after deploying frontend).
    * `GEMINI_API_KEY`: [Get from Google AI Studio] (Optional - if skipped, AI features won't work).
    * `ALPHAVANTAGE_API_KEY`: [Get from AlphaVantage] (Optional).
    * `DROPBOX_API_KEY`: [Get from Dropbox] (Optional).

### C. Data Persistence (Supabase)

**Yes, your data is extremely safe on Supabase.**

1. **Persistence**: Supabase is a managed database. It is persistent by default.
2. **Backups**: Supabase handles automatic backups for you.
3. **Interface**: You can view/edit data directly in their dashboard "Table Editor".

---

## 3. "Placeholders" & Future Features

Your project is **complete** for a launch MVP. You do *not* need empty placeholders, but keep these in mind for future AI updates:

1. **AI Services**: Currently, you use internal logic (`BillService` for recurring, heuristics for categorization).
    * *future*: If you add real OpenAI/Gemini integration, you will simply create a new `AiService.java` class. No need to add empty files now.
2. **Bank API**: Real bank connections (Plaid/Yodlee) require a paid account. Your current "Bank Connection" UI is a perfect mock placeholder for now.

## 4. Is it "Incomplete"?

**No.**

* ✅ **Auth**: Works (Login/Register).
* ✅ **Database**: Schema is defined.
* ✅ **Business Logic**: Bills, Transactions, Savings work.
* ✅ **SEO**: Implemented.

You are ready to go live!
