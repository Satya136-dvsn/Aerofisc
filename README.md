# 💰 BudgetWise - Enterprise Budget Tracking Application

A comprehensive, enterprise-grade budget tracking and financial management application built with Spring Boot and React, featuring advanced security, AI-powered insights, and real-time analytics.

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
- 📤 **Professional Exports** - Generate beautiful PDF reports with charts and Excel files with native visualizations
- 🔄 **Automatic Backups** - Database configuration for reliability
- ⚡ **Performance** - Optimized with caching and database indexing for sub-second response times

### 🔒 Security Features (NEW!)

- 🔐 **JWT Token Rotation** - Automatic refresh token rotation for enhanced security
- 🛡️ **Rate Limiting** - Protect against brute force attacks (5 req/min on auth endpoints)
- 🔑 **Password Strength Validation** - Enforce strong passwords (8+ chars, uppercase, lowercase, digit, special char)
- 👮 **Role-Based Access Control** - Admin authorization with `@PreAuthorize` annotations
- 📝 **Session Management** - View and revoke active sessions across devices
- 🔍 **Audit Logging** - Track all security-critical operations
- 🚨 **MFA Support** - Two-factor authentication with TOTP
- 🔐 **Security Headers** - HSTS, CSP, XSS Protection, Frame Options

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
│   ├── security/        # JWT, Rate Limiting, Filters
│   ├── config/          # Security, CORS, Cache configuration
│   ├── util/            # Password validation, helpers
│   └── annotation/      # Custom annotations (Auditable)
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
│   │   └── settings/    # SessionManagement, SecuritySettings
│   ├── pages/           # Application pages (Dashboard, Bills, Analytics)
│   ├── services/        # API service clients, Axios config
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

# JWT Configuration
jwt.secret=change-this-to-a-very-long-secure-random-string-in-production
jwt.expiration=900000  # 15 minutes
jwt.refresh-expiration=604800000  # 7 days

# Security
spring.security.enabled=true
```

### 4. Start Backend

```bash
cd backend
mvn spring-boot:run
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

**Default Admin Account:**

- Email: <admin@budgetwise.com>
- Password: Admin123! (Change immediately!)

## 📚 Documentation

- [Security API Documentation](SECURITY_API.md) - Complete security endpoint reference
- [Security Best Practices](SECURITY_GUIDE.md) - Developer security guidelines
- [Roadmap](ROADMAP.md) - Future enhancements and timeline
- [Internship Report](INTERNSHIP_REPORT.md) - Comprehensive project documentation
- [Walkthrough Guide](bills_investments_walkthrough.md) - Feature guides

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

# Security
jwt.secret=${JWT_SECRET:your-secret-key}
jwt.expiration=900000
jwt.refresh-expiration=604800000

# Logging
logging.level.com.budgetwise=INFO
```

### Frontend Configuration

The frontend connects to the backend at `http://localhost:8080` by default.
Configure in `frontend/src/services/axiosConfig.js`.

## 🧪 Testing

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Security Feature Tests

```bash
cd backend
.\test_security_features.ps1
```

## 📦 Build for Production

### Backend

```bash
cd backend
mvn clean package
java -jar target/budgetwise-backend-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd frontend
npm run build
```

Build output will be in `frontend/dist/`

## 🔐 Security Features

### Authentication & Authorization

- ✅ JWT-based authentication with Bearer tokens
- ✅ Refresh token rotation (automatic on token refresh)
- ✅ Password encryption with BCrypt (work factor 12)
- ✅ Role-based authorization (User/Admin)
- ✅ Multi-factor authentication (MFA/TOTP)

### Security Hardening

- ✅ Rate limiting (5 requests/min on auth endpoints)
- ✅ Password strength validation
- ✅ Admin-only endpoint protection
- ✅ Session management (view/revoke sessions)
- ✅ Audit logging for security events
- ✅ Security headers (HSTS, CSP, XSS Protection)

### Session Management

- ✅ View active sessions across devices
- ✅ Revoke individual sessions
- ✅ "Logout from all devices" functionality
- ✅ JWT token expiration (15 min access, 7 day refresh)

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token (with rotation)
- `POST /api/auth/setup-mfa` - Setup MFA
- `POST /api/auth/verify-mfa` - Verify MFA code

### Session Management

- `GET /api/sessions` - Get active sessions
- `DELETE /api/sessions/{id}` - Revoke specific session
- `DELETE /api/sessions/all` - Revoke all other sessions

### Dashboard

- `GET /api/dashboard/summary` - Get financial summary
- `GET /api/dashboard/trends` - Get spending trends

### Transactions

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Admin Endpoints

- `GET /api/audit/all` - Get all audit logs (Admin only)

See [SECURITY_API.md](SECURITY_API.md) for complete API documentation.

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

See [ROADMAP.md](ROADMAP.md) for detailed future plans.

### Next Up (Q1 2026)

- [ ] Docker containerization
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Mobile responsiveness improvements
- [ ] Unit & Integration tests
- [ ] Database optimization

### Coming Soon (Q2-Q3 2026)

- [ ] Performance optimization
- [ ] PDF/Excel report exports
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Multi-currency support

### Long Term (Q4 2026+)

- [ ] Mobile app (React Native)
- [ ] Cryptocurrency tracking
- [ ] Bill payment integration
- [ ] Advanced AI advisor

## 📊 Project Stats

- **Lines of Code**: ~20,000+
- **Components**: 60+
- **API Endpoints**: 40+
- **Security Features**: 8+
- **Tech Stack**: Java, Spring Boot, React, MySQL, JWT

## 🔒 Security Disclosure

If you discover a security vulnerability, please email <d.v.satyanarayana260@gmail.com> instead of using the issue tracker.

---

<div align="center">

**Made with ❤️ by the BudgetWise Team**

⭐ Star us on GitHub — it helps!

</div>
