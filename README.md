# Aerofisc - Personal Finance Command Center

![Build Status](https://img.shields.io/github/actions/workflow/status/Satya136-dvsn/Aerofisc/ci.yml?branch=master&style=for-the-badge)
![License](https://img.shields.io/github/license/Satya136-dvsn/Aerofisc?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql)

**Aerofisc** is an enterprise-grade, AI-driven personal finance management system designed to provide comprehensive financial visibility, intelligent insights, and automated wealth management. Built on a microservices-ready Spring Boot architecture and a responsive React frontend, it bridges the gap between traditional budgeting apps and professional financial planning tools.

---

## 🚀 Key Features

### 🧠 AI-Powered Insights

- **Predictive Analytics**: Forecasts future expenses using historical data and linear regression models.
- **Smart Categorization**: automatically categorizes transactions using machine learning logic.
- **Voice Commands**: Integrated voice-to-action engine for hands-free financial management.

### 💰 Comprehensive Financial Management

- **Transactions & Budgeting**: Real-time tracking with drill-down capabilities.
- **Savings Goals**: Goal-oriented savings tracking with progress visualization.
- **Debt Management**: Snowball/Avalanche payoff simulators.
- **Investment Tracking**: Real-time stock portfolio monitoring (AlphaVantage integration).

### 🔒 Enterprise Security

- **JWT Authentication**: Stateless, secure authentication with refresh token rotation.
- **Role-Based Access Control (RBAC)**: Granular permissions for Users and Admins.
- **Data Encryption**: Sensitive data encryption at rest and in transit.

---

## 📊 Project Status & Supported Features

Aerofisc is currently deployed in a production-ready state. The architecture supports **17 fully functional modules** wired end-to-end to the Spring Boot backend and PostgreSQL database, demonstrating robust enterprise-grade capabilities.

| Feature Area | Status | Description |
| :--- | :--- | :--- |
| **Authentication** | 🟢 Live | Secure JWT-based registration, login, and token refresh logic. |
| **Core Transactions** | 🟢 Live | Dashboard, Transactions, Recurring rules, Custom Categories, Budgets. |
| **Advanced Planning** | 🟢 Live | Savings Goals, Debt Management, Investments, Retirement, Tax, Scenario Analysis. |
| **AI Integration** | 🟢 Live | Google Gemini-powered AI Assistant and predictive spending insights. |
| **Analytics & Reports**| 🟢 Live | Visual charts, flow metrics, and comprehensive PDF/Excel report generation. |
| **Settings & Auth** | 🟢 Live | Profile updates, settings configurations, and clean session management. |
| **Banking Integration** | 🟡 Mocked | Interface built; currently uses simulated data (architected for future Plaid integration). |
| **Bills & Community** | 🟡 Mocked | UI fully built; uses robust mock services awaiting future controller bindings. |

---

## 🏗 System Architecture

```mermaid
graph TD
    Client[Web/Mobile Client] -->|HTTPS/REST| LoadBalancer[Nginx / Vercel]
    LoadBalancer -->|Static Assets| CDN[CDN]
    LoadBalancer -->|API Requests| API[Spring Boot Backend]
    
    subgraph "Backend Services"
        API -->|Auth| Security[Spring Security / JWT]
        API -->|Data| DataLayer[Spring Data JPA]
        API -->|Logic| ServiceLayer[Business Logic]
        API -->|Async| Events[Event Publisher]
    end
    
    subgraph "Data Storage"
        DataLayer -->|Persist| DB[(PostgreSQL)]
        DataLayer -->|Cache| Cache[(Redis)]
    end
    
    subgraph "External Integrations"
        ServiceLayer -->|Stocks| AlphaVantage[AlphaVantage API]
        ServiceLayer -->|AI| Gemini[Google Gemini AI]
        ServiceLayer -->|Storage| Dropbox[Dropbox API]
    end
```

---

## 🛠 Tech Stack

### Backend

- **Framework**: Spring Boot 3.2.0 (Java 21)
- **Database**: PostgreSQL 15 (Production), H2 (Testing)
- **Security**: Spring Security, JWT (jjwt 0.12.3)
- **Docs**: OpenAPI / Swagger UI
- **Build Tool**: Maven

### Frontend

- **Framework**: React 18 (Vite)
- **UI Library**: Material UI (MUI) v5
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Styling**: Emotion

### DevOps & Infrastructure

- **Containerization**: Docker (Multi-stage builds)
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: Render (Backend), Vercel (Frontend)

---

## 🔌 API Documentation

The API follows RESTful standards. Comprehensive interactive documentation is available via Swagger UI.

### Key Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and retrieve JWT |
| `GET` | `/api/transactions` | Retrieve user transactions (paged) |
| `POST` | `/api/ocr/upload` | Upload receipt for OCR processing |
| `GET` | `/api/analytics/summary` | Get financial dashboard summary |

> **Note**: Full documentation is available at `/swagger-ui.html` when running the backend locally.

---

## 🐳 Local Development (Docker)

The easiest way to run the full stack is via Docker Compose.

### Prerequisites

- Docker & Docker Compose
- Git

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Satya136-dvsn/Aerofisc.git
   cd Aerofisc
   ```

2. **Configure Environment**
   Create a `.env` file in the root directory (optional, defaults provided in `docker-compose.yml`):

   ```properties
   POSTGRES_PASSWORD=secure_password
   JWT_SECRET=your_long_secure_secret
   ```

3. **Start Application**

   ```bash
   docker-compose up -d --build
   ```

4. **Access Application**
   - Frontend: `http://localhost:80`
   - Backend API: `http://localhost:8080`
   - Swagger Docs: `http://localhost:8080/swagger-ui.html`

---

## 🖥 Local Development (Manual)

### Backend Setup

1. Additional prerequisites: Java 21, Maven.
2. Navigate to backend: `cd backend`
3. Run application:

   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. Additional prerequisites: Node.js 18+.
2. Navigate to frontend: `cd frontend`
3. Install dependencies:

   ```bash
   npm install --legacy-peer-deps
   ```

4. Start dev server:

   ```bash
   npm run dev
   ```

---

## 🧪 Testing & Quality

- **Backend**: Run `mvn test` for unit and integration tests (JUnit 5, Mockito).
- **Frontend**: Run `npm test` for component testing.
- **CI/CD**: Automated pipelines run on every push to `master`, executing build checks and tests.

---

## 📈 Scaling Strategy

The Aerofisc architecture (Stateless Backend + Edge Frontend) was meticulously selected to handle heavy concurrency out-of-the-box while remaining cost-effective. Should the platform experience viral growth (e.g., 10,000+ simultaneous users), it is designed to scale seamlessly across three axes:

### 1. Database Scaling (The Primary Bottleneck)

- **Aggressive Caching**: Introduce **Redis** (via Spring Cache) to cache expensive, read-heavy endpoints such as the Dashboard analytics, Financial Health scores, and Category aggregations. This drastically reduces the hit rate on the primary database.
- **Connection Optimization**: We utilize **pgBouncer** for advanced connection pooling to prevent pool exhaustion during massive traffic spikes.
- **Read Replicas**: Transition Supabase/PostgreSQL to a dedicated instance cluster, routing write operations (`POST`, `PUT`, `DELETE`) to the primary DB, while distributing complex read queries (`GET`) across multiple synchronized read replicas.

### 2. Backend Compute Scaling

- **Horizontal Scaling via Statelessness**: Since the Spring Boot application handles authentication via JWTs (JSON Web Tokens), it stores **zero local session state**. This means we can dynamically spin up 50+ backend instances behind a Load Balancer (e.g., on Render or Kubernetes) without sticky-session issues.
- **Microservices Decoupling**: Currently acting as a modular monolith, resource-intensive domains—like the **AI Chat/Gemini integration** and the **Scenario Analysis engine**—can be easily sliced out into independent, autoscaling microservices (potentially in Go or Python) to protect core transactional throughput.

### 3. Frontend & Network Delivery

- **Global Edge Network**: The React frontend is deployed via **Vercel**, inherently placing static assets and application bundles on a global Content Delivery Network (CDN) for infinite scalable delivery.
- **Optimistic UI & Client Caching**: Employ **React Query (TanStack)** for intelligent local data caching and revalidation. This ensures that users navigating between complex views (like Analytics and Budgets) instantly see locally cached data, preventing redundant backend API calls entirely.

---

## 🔮 Roadmap

- [ ] Mobile App (React Native)
- [ ] Bank Account Integration (Plaid)
- [ ] Advanced Investment Forecasting (Monte Carlo Simulations)
- [ ] Multi-currency Support

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Developed by Satya136-dvsn**
