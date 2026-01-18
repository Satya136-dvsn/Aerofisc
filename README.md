# 💰 BudgetWise Tracker - AI-Driven Smart Finance Management

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)

---

## 🧐 What is BudgetWise Tracker?

**BudgetWise Tracker** is a comprehensive, full-stack personal finance application designed to help individuals take control of their financial life. Unlike simple expense loggers, this project leverages **AI and Automation** to reduce manual effort. It acts as a personal financial assistant that organizes detailed financial data into actionable insights, helping users save money and track spending effortlessly.

This project serves as a demonstration of **modern, scalable software architecture**, integrating a robust set of features from recurring payments to predictive AI categorization.

---

## 🎯 Who is this for?

This application is built for:

* **👨‍👩‍👧 Individuals & Families**: Anyone looking for a powerful tool to track monthly budgets, manage recurring bills, and visualize spending habits without using complex spreadsheets.
* **💼 Detailed Planners**: Users who want granular control over their finances, including custom categories, savings targets, and debt tracking.
* **💻 Developers & Recruiters**: A reference implementation for a production-grade **Spring Boot + React** application. It showcases best practices in security (JWT), state management, RESTful API design, and database modeling.

---

## ⚡ What can it do?

BudgetWise covers the entire spectrum of personal finance management:

* **Automate Recurring Bills**: Set up rent, Netflix, or EMI payments once. The system automatically creates transactions and updates your budget every month.
* **AI-Powered Categorization**: Typed "Starbucks"? The AI automatically tags it as *Food & Drink*, saving you time.
* **Track & Limit Spending**: Set monthly limits for categories (e.g., "Dining Out"). Get visual alerts when you cross 80% of your budget.
* **Visualize Financial Health**: Interactive charts breakdown your income vs. expenses, showing exactly where every rupee goes.
* **Goal-Based Savings**: Create specific goals (e.g., "New Phone") and track your progress visually as you set money aside.
* **Export Data**: Download professional PDF reports or Excel sheets for tax filing or offline analysis.

---

## 📖 User Guide: How to Use

### 1. Getting Started

* **Sign Up**: Create a secure account using your email. We use **JWT (JSON Web Token)** encryption, so your session is secure and stateless.
* **Profile Setup**: Set your monthly income and financial goals to help the AI calibrate your budget recommendations.

### 2. Dashboard & Analytics

Upon logging in, the **Dashboard** serves as your financial command center:

* **Monthly Overview**: See exactly how much you've earned vs. spent this month.
* **Trend Analysis**: Interactive, animated charts show your spending habits over the last 6 months.
* **Category Breakdown**: A donut chart visualizes where your money goes (e.g., "40% Housing", "20% Food").

### 3. Managing Transactions

* **Add Transaction**: Click the `+` button. Enter the amount and description.
* **Suggest with AI**: Click "Suggest Category with AI" to let the system auto-classify your spending.
* **Upload Receipts**: Attach images/PDFs for record-keeping.

### 4. Smart Recurring Payments

* **Set It Once**: Go to the **Recurring** tab. Add your Rent or Subscriptions.
* **Auto-Creation**: The system handles the rest on the due date.
* **Pause/Resume**: Temporarily stop a recurring payment (e.g., while traveling) with one click.

### 5. Budgets & Alerts

* **Set Limits**: Define monthly budgets for specific categories.
* **Track Progress**: Watch the progress bars fill up as you spend.
* **Get Alerts**: Receive warnings when you're nearing your limit.

### 6. Savings Goals

* **Create Goals**: Set a target amount for big purchases.
* **Contribute**: Log contributions and see your "Percent Complete" ring grow.

### 7. Exporting Reports

* **Generate Reports**: Go to **Transactions** or **Savings** > **Export**.
* **Download**: Get data in Excel or PDF format instantly.

---

## 🛠️ Technical Architecture

This project is built with scalability and maintainability in mind, following **SOLID principles** and **Clean Architecture**.

### **Backend (Spring Boot 3.2)**

* **Core**: Java 21, Spring Boot, Spring Data JPA.
* **Database**: MySQL 8.0 (Relational Data Integrity).
* **Security**: Spring Security + JWT Authentication Filter (Stateless).
* **Concurrency**: `@Async` scheduled tasks for processing recurring transactions.
* **Optimization**: Caching with Spring Cache (Redis-ready) for heavy dashboard queries.

### **Frontend (React + Vite)**

* **Core**: React 18, React Router v6.
* **State Management**: Context API (Auth, Theme) + Custom Hooks.
* **UI Library**: Material UI (MUI) v5 for a polished, responsive design.
* **Data Fetching**: Axios with centralized interceptors for error handling and token management.
* **PWA**: Fully responsive mobile-first layout.

---

## 🚀 Installation & Setup

### Prerequisites

* Java JDK 21
* Node.js 18+
* MySQL Server

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

1. Fork the repository.
2. Create a branch (`git checkout -b feature/NewFeature`).
3. Commit changes (`git commit -m 'Add NewFeature'`).
4. Push to branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

**© 2026 BudgetWise Tracker**. Built with ❤️ for better financial health.
