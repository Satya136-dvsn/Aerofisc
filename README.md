# ✈️ Aerofisc - Intelligent Financial Autopilot

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Three.js](https://img.shields.io/badge/3D-Three.js-black.svg?logo=three.js)

> **Aerofisc** is a production-grade personal finance operating system. It combines predictive AI, real-time analytics, and automated wealth tracking into a single, high-performance interface.

---

## 🚀 Live Demo

**[👉 Launch Aerofisc](https://aerofisc.vercel.app/)**

> **Note:** The backend is hosted on **Render's Free Tier**, which "spins down" after inactive periods. Please allow up to **50 seconds** for the initial cold start. Once active, the application runs at full native speed.

---

## 💎 Key Features

### 🧠 Financial Intelligence (AI)

* **Predictive Cash Flow**: Analyzes 24 months of spending history to forecast your ending balance for the next 30 days.
* **Smart Categorization**: Automatically tags incoming transactions using heuristic and keyword-based matching algorithms.

### ⚡ Professional Layout (New)

* **Mesh Gradient Design**: High-performance "Aurora" backgrounds using CSS Keyframes and Framer Motion (No WebGL crash risk).
* **Bento Grid Interface**: Modern, glassmorphic card layout maximizing data density without clutter.
* **Responsive Typography**: Fluid scaling using `clamp()` ensures perfect readability on all devices, from 4K monitors to mobile phones.

### 🔐 Enterprise-Grade Security

* **Stateless Authentication**: Pure JWT (JSON Web Token) implementation with secure HTTP-only cookies.
* **Rate Limiting**: Custom Bucket4j implementation to prevent brute-force attacks.
* **Input Sanitization**: Rigorous validation against OWASP Top 10 vulnerabilities (XSS, SQL Injection).

### 🛠️ Automation

* **Recurring Engine**: Spring `@Scheduled` tasks monitor your bills daily and auto-create transactions when they are due.
* **Advanced Reporting**: Generate audit-ready PDF and Excel exports using `iText` and `Apache POI`.

---

## 🏗️ System Architecture

**Aerofisc** follows a decoupled, three-tier architecture designed for scalability:

* **Frontend**: React 18 (Vite) + Material UI v5 + Framer Motion
* **Backend**: Spring Boot 3.2 (Java 21) + Spring Security
* **Database**: MySQL 8.0 (Managed Cloud Instance)

This separation ensures that the frontend can be deployed to CDNs (Vercel) for global edge performance, while the backend scales independently.

---

## 🛠️ Tech Stack

### Backend (Java Ecosystem)

* **Core**: Spring Boot 3.2, Java 21 LTS
* **Data**: Spring Data JPA, Hibernate, MySQL
* **Security**: Spring Security, JWT, BCrypt
* **Optimization**: Spring Cache (Redis), Thread Pooling
* **Tools**: Lombok, Maven, Docker

### Frontend (Modern Web)

* **Core**: React 18, Vite
* **Visuals**: Material UI (MUI), Framer Motion, Recharts
* **3D/Graphics**: React Three Fiber, CSS Mesh Gradients
* **State**: Context API, React Query (TanStack)

### DevOps

* **CI/CD**: GitHub Actions (Automated Testing & Build)
* **Containerization**: Docker, Docker Compose
* **Infrastructure**: Render (Backend), Vercel (Frontend), Clever Cloud (DB)

---

## 🛣️ Development Roadmap

* **Phase 1 (Completed)**: Core CRUD, Auth, and Basic Tracking.
* **Phase 2 (Completed)**: Automation (Recurring Bills) and Advanced Relationships.
* **Phase 3 (Completed)**: High-Performance Landing Page Redesign (Mesh Gradients).
* **Phase 4 (Current)**: Mobile App (React Native) and Bank Integration (Plaid).

---

## 🤝 Contributing

We welcome contributions from the open-source community.

1. **Fork** the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

---

**© 2026 Aerofisc Inc.** • Designed for the Future of Finance.
