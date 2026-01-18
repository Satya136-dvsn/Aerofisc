# BudgetWise Tracker - AI-Driven Smart Finance Management 🚀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)

**BudgetWise Tracker** is a comprehensive, full-stack personal finance application designed to help individuals take control of their financial life. Built with a robust **Spring Boot** backend and a responsive **React** frontend, it leverages meaningful data visualization and automation to simplify budgeting, tracking, and savings.

---

## 🌟 Key Features

### 🤖 Smart Automation & AI
- **Recurring Transactions**: Set up automated income and expense entries (Daily, Monthly, Yearly). Pause, resume, or edit them anytime with real-time syncing.
- **AI Categorization (Beta)**: Intelligent suggestion engine that predicts transaction categories based on description and amount.

### 📊 Powerful Analytics
- **Interactive Dashboard**: Real-time overview of your financial health with dynamic charts (Income vs Expense, Category Breakdown).
- **Budget Tracking**: Set monthly budgets for specific categories and get visual alerts when nearing limits.
- **Savings Goals**: Create target-based savings goals and track contributions visually.

### 💼 Professional Tools
- **Export Capabilities**: Generate detailed PDF and Excel reports for taxes or offline archiving.
- **Bill Management**: Never miss a due date with the dedicated Bill tracking module.
- **Secure Authentication**: Enterprise-grade security using JWT (JSON Web Tokens) and Spring Security.

---

## 🛠️ Technology Stack

This project is built using modern, industry-standard technologies to ensure scalability, performance, and maintainability.

### **Frontend (Client-Side)**
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **UI Component Library**: [Material UI (MUI)](https://mui.com/)
- **State Management**: React Hooks & Context API
- **Data Visualization**: [Recharts](https://recharts.org/)
- **HTTP Client**: Axios (with Interceptors)

### **Backend (Server-Side)**
- **Framework**: [Spring Boot 3.2](https://spring.io/projects/spring-boot)
- **Language**: Java 21
- **Database**: MySQL 8.0
- **ORM**: Hibernate & Spring Data JPA
- **Security**: Spring Security & JWT
- **Build Tool**: Maven

### **DevOps & Tools**
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git & GitHub

---

## 🎯 Target Audience & Use Case
- **Individuals & Families**: Perfect for tracking daily expenses and managing household budgets.
- **Freelancers**: efficient way to separate and categorize business vs. personal expenses.
- **Students**: Simple tool to manage limited monthly allowances and save for goals.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
- **Java JDK 21+**
- **Node.js 18+** & **npm**
- **MySQL Server** (or Docker for containerized DB)
- **Maven**

### 1. Clone the Repository
```bash
git clone https://github.com/Satya136-dvsn/budgetwise_tracker_ai_driven.git
cd budgetwise_tracker_ai_driven
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure your database in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/budgetwise
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The server will start on `http://localhost:8080`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

### 🐳 Docker Setup (Optional)
You can run the entire stack (Frontend + Backend + Database) using Docker Compose:
```bash
docker-compose up --build
```

---

## 📸 Application Screenshots

*(Placeholders for future screenshots)*
| Dashboard | Transactions |
|:---:|:---:|
| *Visual overview of expenses* | *Detailed list with filters* |

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project, please fork the repository and submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by Satya
</p>
