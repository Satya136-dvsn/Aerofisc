# 💰 BudgetWise Tracker - AI-Driven Smart Finance Management

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)

**BudgetWise Tracker** is an intelligent personal finance application designed to modernize how individuals manage their money. By combining standard budgeting tools with **AI-powered automation**, it reduces the friction of manual tracking and provides actionable insights instantly.

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [User Guide: How to Use](#-user-guide-how-to-use)
    - [Getting Started](#1-getting-started)
    - [Dashboard & Analytics](#2-dashboard--analytics)
    - [Managing Transactions](#3-managing-transactions)
    - [Smart Recurring Payments](#4-smart-recurring-payments)
    - [Budgets & Alerts](#5-budgets--alerts)
    - [Savings Goals](#6-savings-goals)
    - [Exporting Reports](#7-exporting-reports)
3. [Technical Architecture](#-technical-architecture)
4. [Installation & Setup](#-installation--setup)
5. [Contributing](#-contributing)

---

## 🌟 Project Overview

Traditional finance apps are tedious. **BudgetWise Tracker** solves this by automating the boring parts.

- **For Users**: A seamless, "set and forget" experience for recurring bills, with AI help for daily spending.
- **For Recruiters/Developers**: A showcase of modern **Full-Stack Architecture**, demonstrating complex state management, real-time data synchronization, and secure REST APIs.

---

## 📘 User Guide: How to Use

### 1. Getting Started

* **Sign Up**: Create a secure account using your email. We use **JWT (JSON Web Token)** encryption, so your session is secure and stateless.
- **Profile Setup**: Set your monthly income and financial goals to help the AI calibrate your budget recommendations.

### 2. Dashboard & Analytics

Upon logging in, the **Dashboard** serves as your financial command center:
- **Monthly Overview**: See exactly how much you've earned vs. spent this month.
- **Trend Analysis**: Interactive, animated charts show your spending habits over the last 6 months.
- **Category Breakdown**: A donut chart visualizes where your money goes (e.g., "40% Housing", "20% Food").
- **Recent Activity**: Quick access to your latest 5 transactions.

### 3. Managing Transactions

* **Add Transaction**: Click the `+` button. Enter the amount and description.
- **✨ AI-Powered Categorization**: Not sure if "Starbucks" is *Food* or *Entertainment*? Click **"Suggest Category with AI"**. The system analyzes the description and amount to automatically select the most accurate category.
- **Upload Receipts**: Attach images or PDFs to keep proof of purchase.

### 4. Smart Recurring Payments

Never forget a subscription again.
- **Set It Once**: Go to the **Recurring** tab. Add your Rent (`₹15000`, Monthly) or Netflix (`₹649`, Monthly).
- **Auto-Creation**: The system automatically creates the transaction on the due date.
- **Pause/Resume**: Going on vacation? Pause your "Gym Membership" recurring payment with one click. Resume it when you're back.

### 5. Budgets & Alerts

* **Create a Budget**: Go to **Budgets**. Select a category (e.g., "Groceries") and set a limit (e.g., `₹10,000`).
- **Visual Progress**: As you add grocery transactions, the progress bar fills up.
- **Smart Alerts**: You will receive an alert if you exceed **80%** of your budget, helping you curb spending *before* it's too late.

### 6. Savings Goals

* **Dream Big**: Create a goal (e.g., "New Laptop", Target: `₹80,000`).
- **Track Contributions**: Add funds to your goal. The circular progress indicator motivates you as you get closer to 100%.
- **Projected Date**: Based on your saving rate, the app estimates *when* you will reach your goal.

### 7. Exporting Reports

* **Tax Ready**: Needs to share data with an accountant?
- **Formats**: Go to **Transactions** or **Savings** and click **Export**.
- **Download**: Get a clean **Excel** spreadsheet or a professional **PDF** summary instantly.

---

## 🛠️ Technical Architecture

This project is built with scalability and maintainability in mind, following **SOLID principles** and **Clean Architecture**.

### **Backend (Spring Boot 3.2)**

* **Core**: Java 21, Spring Boot, Spring Data JPA.
- **Database**: MySQL 8.0 (Relational Data Integrity).
- **Security**: Spring Security + JWT Authentication Filter (Stateless).
- **Concurrency**: `@Async` scheduled tasks for processing recurring transactions.
- **Optimization**: Caching with Spring Cache (Redis-ready) for heavy dashboard queries.

### **Frontend (React + Vite)**

* **Core**: React 18, React Router v6.
- **State Management**: Context API (Auth, Theme) + Custom Hooks.
- **UI Library**: Material UI (MUI) v5 for a polished, responsive design.
- **Data Fetching**: Axios with centralized interceptors for error handling and token management.
- **PWA**: Fully responsive mobile-first layout.

---

## 🚀 Installation & Setup

Want to run this locally? Follow these steps.

### Prerequisites

* Java JDK 21
- Node.js 18+
- MySQL Server

### Step 1: Clone the Repo

```bash
git clone https://github.com/Satya136-dvsn/budgetwise_tracker_ai_driven.git
```

### Step 2: Backend Setup

1. Navigate to `backend/`.
2. Update `application.properties` with your MySQL credentials.
3. Run the server:

    ```bash
    mvn spring-boot:run
    ```

### Step 3: Frontend Setup

1. Navigate to `frontend/`.
2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the dev server:

    ```bash
    npm run dev
    ```

### Step 4: Access

Open `http://localhost:3000` in your browser.

---

## 🤝 Contributing

Found a bug? Want to add a feature?

1. Fork the repository.
2. Create a branch (`git checkout -b feature/NewFeature`).
3. Commit changes (`git commit -m 'Add NewFeature'`).
4. Push to branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

**© 2026 BudgetWise Tracker**. Built with ❤️ for better financial health.
