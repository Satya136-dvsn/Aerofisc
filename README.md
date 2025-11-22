# 💰 BudgetWise - Enterprise Budget Tracking Application

A comprehensive, enterprise-grade budget tracking and financial management application built with Spring Boot and React.

[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2+-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Features

### Core Features

- ✅ **Transaction Management** - Track income and expenses with categories
- ✅ **Budget Planning** - Set and monitor budgets with visual progress tracking
- ✅ **Savings Goals** - Create and track financial goals with milestones
- ✅ **Analytics Dashboard** - Comprehensive financial insights with interactive charts
- ✅ **Bills Management** - Track recurring bills with calendar and year views
- ✅ **Real-time Updates** - Live data synchronization for seamless experience

### Advanced Features

- 🤖 **AI-Powered Predictions** - Expense forecasting using machine learning algorithms
- 💡 **Smart Budget Advisor** - Personalized financial recommendations based on spending habits
- 🔍 **Anomaly Detection** - Identify unusual spending patterns automatically
- 📊 **Investment Tracking** - Monitor portfolio performance with real-time P&L calculation
- 📈 **Live Market Simulator** - Experience real-time market fluctuations with a built-in simulator
- 🔔 **Smart Notifications** - Get alerts for budget limits, bill due dates, and investment updates

### Enterprise Features

- 🔐 **JWT Authentication** - Secure token-based authentication with refresh mechanism
- 📱 **Responsive Design** - Fully responsive UI working on desktop, tablet, and mobile
- 📤 **Data Export** - Export financial reports to CSV
- 🔄 **Automatic Backups** - Database configuration for reliability
- 📧 **Email Notifications** - (Planned) Budget alerts and reminders

## 🏗️ Architecture

### Backend (Spring Boot)

```
backend/
├── src/main/java/com/budgetwise/
│   ├── controller/      # REST API endpoints
│   ├── service/         # Business logic
│   ├── repository/      # Data access layer
│   ├── entity/          # JPA Entity classes
│   ├── dto/             # Data transfer objects
│   ├── security/        # JWT Authentication & authorization
│   ├── config/          # Configuration classes
│   └── util/            # Utility helper classes
├── src/main/resources/
│   ├── application.properties
│   └── application-secrets.properties
└── pom.xml
```

### Frontend (React)

```
frontend/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Application pages (Dashboard, Bills, etc.)
│   ├── services/        # API service clients
│   ├── context/         # React Context (Auth, Theme)
│   ├── theme/           # Material UI theme configuration
│   └── App.jsx          # Main app component
├── public/
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6+

### 1. Clone the Repository

```bash
git clone https://github.com/Satya136-dvsn/budgetwise_tracker_ai_driven.git
cd budgetwise_tracker_ai_driven
```

### 2. Setup Database

```sql
CREATE DATABASE budgetwise;
-- User creation is optional if using root, but recommended for production
-- CREATE USER 'budgetuser'@'localhost' IDENTIFIED BY 'your_password';
-- GRANT ALL PRIVILEGES ON budgetwise.* TO 'budgetuser'@'localhost';
-- FLUSH PRIVILEGES;
```

### 3. Configure Backend

Edit `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/budgetwise?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password

# JWT Secret (Change this in production!)
jwt.secret=budgetwise-secret-key-change-this-in-production-to-a-very-long-secure-random-string
jwt.expiration=3600000
```

### 4. Start Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend will start on <http://localhost:8080>

### 5. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on <http://localhost:3000> (or 5173)

### 6. Access Application

Open <http://localhost:3000> in your browser

## 📚 Documentation

- [Walkthrough Guide](bills_investments_walkthrough.md) - Detailed guide on new features
- [API Documentation](docs/API.md) - (Coming Soon) Swagger/OpenAPI docs

## 🔧 Configuration

### Backend Configuration

Key settings in `backend/src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/budgetwise
spring.jpa.hibernate.ddl-auto=update

# Caching
spring.cache.type=simple
spring.cache.cache-names=dashboard_summary,dashboard_trends

# Logging
logging.level.com.budgetwise=DEBUG
```

### Frontend Configuration

The frontend connects to the backend at `http://localhost:8080` by default.

## 🧪 Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📦 Build for Production

### Backend

```bash
cd backend
./mvnw clean package
java -jar target/budgetwise-backend-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd frontend
npm run build
```

Build output will be in `frontend/dist/`

## 🐳 Docker Deployment (Coming Soon)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🔐 Security Features

- ✅ JWT-based authentication with Bearer tokens
- ✅ Password encryption with BCrypt
- ✅ CORS configuration for secure cross-origin requests
- ✅ Role-based authorization (User/Admin)
- ✅ Secure REST API endpoints

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get token

### Dashboard

- `GET /api/dashboard/summary` - Get financial summary
- `GET /api/dashboard/trends` - Get spending trends

### Transactions

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Bills & Investments

- `GET /api/bills` - Get recurring bills
- `GET /api/investments` - Get investment portfolio
- `GET /api/investments/summary` - Get portfolio performance

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Satya136-dvsn** - *Initial work* - [GitHub](https://github.com/Satya136-dvsn)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing library
- Material-UI for beautiful components
- Recharts for data visualization

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/Satya136-dvsn/budgetwise_tracker_ai_driven/issues)

## 🗺️ Roadmap

### Version 2.0 (Planned)

- [ ] Mobile app (React Native)
- [ ] Cryptocurrency tracking integration (Real API)
- [ ] Bill payment gateway integration
- [ ] Advanced AI financial advisor
- [ ] Social features (share goals)

### Version 1.5 (Current)

- [x] AI-powered predictions
- [x] Investment tracking with simulator
- [x] Recurring bills management
- [x] Comprehensive analytics

## 📊 Project Stats

- **Lines of Code**: ~15,000+
- **Components**: 50+
- **API Endpoints**: 30+
- **Tech Stack**: Java, JavaScript, SQL

---

<div align="center">

**Made with ❤️ by the BudgetWise Team**

</div>
