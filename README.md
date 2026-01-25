# 💰 BudgetWise Tracker - AI-Driven Smart Finance Management

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)

> A full-stack, production-grade personal finance assistant built with Spring Boot and React, focused on automation, analytics, and secure financial tracking.

---

## 🧐 What is BudgetWise Tracker?

**BudgetWise Tracker** is a comprehensive, full-stack personal finance application designed to help individuals take control of their financial life. It acts as a personal financial assistant that organizes detailed financial data into actionable insights, utilizing **automation and smart logic** to reduce manual effort.

This project serves as a demonstration of **modern, scalable software architecture**, integrating a robust set of features from recurring payments to advanced analytics.

---

## 🎯 Who is this for?

* **Individuals & Families**: For tracking budgets, recurring bills, and spending habits without complex spreadsheets.
* **Detailed Planners**: For granular control over categories, savings targets, and debt tracking.
* **Developers & Recruiters**: Reference implementation for a production-grade **Spring Boot + React** application. Showcases best practices in security (JWT), state management, RESTful API design, and database modeling.

---

## ✨ Implemented Features

### 🔐 Security & User Management

- Secure Authentication using Stateless JWT
* Input validation and request filtering
* API rate limiting (custom implementation)

### 💸 Core Finance & Automation

- Smart recurring payments using Spring Scheduler (`@Scheduled`)
* Budget enforcement with real-time utilization tracking
* Transaction and category management
* Savings and expense tracking

### 📊 Analytics & Reporting

- Interactive dashboards using Recharts
* Aggregated financial insights (income vs expense, category breakdown)
* Professional PDF and Excel export (iText, Apache POI)

---

## 🛣️ Planned / Roadmap

The following enhancements are planned or under exploration:

* Receipt scanning using OCR (Tesseract.js)
* Predictive analytics using statistical or ML models
* Multi-factor authentication (TOTP / Google Authenticator)
* Cloud backups via Google Drive API
* Real-time dashboard updates using WebSockets
* Mobile application (React Native)
* Family / shared budget workspaces

---

## 🏗️ System Architecture

BudgetWise follows a standard three-tier architecture:

* **Frontend**: React (Vite) consuming REST APIs
* **Backend**: Spring Boot REST API secured with JWT
* **Database**: MySQL with optimized relational modeling

This separation ensures scalability, maintainability, and security.

---

## 🛠️ Tools & Technologies

### Backend (Java Ecosystem)

* **Framework**: Spring Boot 3.2 (Web, Data JPA, Security, Validation)
* **Language**: Java 21 (LTS)
* **Database**: MySQL 8.0
* **Security**: Spring Security + JWT (Stateless Authentication)
* **Performance**: Spring Cache (Redis), Application Level Caching
* **Utilities**:
  * **Lombok**: Reduces boilerplate code.
  * **iText / Apache POI**: For PDF and Excel generation.

### Frontend (Modern Web)

* **Framework**: React 18
* **Build Tool**: Vite
* **Styling**: Material UI (MUI) v5
* **State & Networking**:
  * **Context API**: Global state management.
  * **Axios**: Optimized HTTP client with interceptors.
* **Advanced Features**:
  * **Recharts**: Data visualization.

### DevOps & Tools

* **Version Control**: Git & GitHub
* **Containerization**: Docker & Docker Compose
* **API Testing**: Postman / Swagger UI

---

## 🛣️ Development Journey: From Basic to Advanced

The development of BudgetWise Tracker followed a structured, phased approach, evolving from a simple CRUD application to a sophisticated financial platform.

### Phase 1: The Foundation & Core Logic

We started by building a robust backend with **Spring Boot** and a responsive **React** frontend.

* **Goal**: Establish secure user management and basic transaction tracking.
* **Achievement**: Created a secure environment where users could register, login, and perform basic Add/Edit/Delete operations.

### Phase 2: Logic Hardening & Data Modeling

Once the base was stable, we introduced complex relationships.

* **Goal**: Implement "Budgets" that actually restrict/monitor spending categories.
* **Solution**: Implemented strict JPA relationships and optimized queries to recalculate budget utilization instantly.

### Phase 3: Automation & The "Assistant" Factor

We moved from "Passive Tracking" to "Active Management".

* **Feature**: **Recurring Payments**.
* **Implementation**: Utilized **Spring's `@Scheduled`** tasks to check for due bills daily and auto-generate transactions.

### Phase 4: Intelligence & Polishing

This phase focused on User Experience (UX) and performance.

* **Reporting**: Added iText and Apache POI to generate professional PDF and Excel reports.
* **Visualization**: Integrated interactive charts to visualize spending habits.

### Phase 5: Security & Performance Optimization

The final polish for production readiness.

* **Security**: Added Custom Rate Limiting and strict input validation.
* **Performance**: Integrated **Spring Cache (Redis)** for dashboard endpoints to reduce latency.

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

## 📌 Project Status

Feature-complete. Actively maintained for improvements and optimizations.

---

## 📄 Resume & Interview Notes

This project demonstrates:

* Full-stack application design
* Secure REST API development
* Automated background processing and Scheduling
* Performance optimization using caching
* Real-world finance domain modeling

---

## 🤝 Contributing

1. Fork the repository.
2. Create a branch (`git checkout -b feature/NewFeature`).
3. Commit changes (`git commit -m 'Add NewFeature'`).
4. Push to branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

**© 2026 BudgetWise Tracker**. Built with ❤️ for better financial health.
