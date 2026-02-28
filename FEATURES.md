# Project Features Documentation

## Overview

Aerofisc Tracker is a comprehensive financial management application with the following major features:

## 1. User Authentication & Security

### Features

- User registration with email verification
- Secure login with JWT tokens
- Password encryption using BCrypt
- Role-based authorization (USER, ADMIN)
- Token refresh mechanism
- Session management

### Technical Implementation

- Spring Security configuration
- JWT token generation and validation
- Custom UserDetailsService
- SecurityFilterChain with stateless session

## 2. Dashboard

### Features

- Real-time financial summary
- Total income, expenses, and net savings cards
- Monthly trends visualization
- Category-wise spending breakdown
- Recent transactions list
- Quick action buttons

### Visualizations

- Line chart: Income vs Expenses over time
- Pie chart: Spending by category
- Progress bars: Budget utilization
- Trend indicators: Increase/decrease from previous period

## 3. Transaction Management

### Features

- Create income and expense transactions
- Categorize transactions (Food, Transport, Entertainment, etc.)
- Add descriptions and notes
- Edit and delete transactions
- Date-based filtering
- Search by description
- Anomaly detection for unusual expenses

### Categories

- System categories (predefined)
- Custom user categories
- Color-coded for visual distinction
- Icon support

## 4. Budget Planning

### Features

- Create monthly, quarterly, or yearly budgets
- Set budgets per category
- Real-time spent tracking
- Visual progress indicators
- Alert threshold configuration
- Budget vs Actual comparison
- Automatic notifications when exceeding limits

### Business Logic

- Automatic spent calculation from transactions
- Period-based budget reset
- Multi-category support
- Historical budget tracking

## 5. Savings Goals

### Features

- Create financial goals with target amounts
- Set deadlines
- Track progress with visual indicators
- Contribute to goals from transactions
- Goal status management (Active, Completed, Cancelled)
- Progress percentage calculation
- Achievement notifications

### Goal Types

- Emergency Fund
- Vacation
- New Car
- Home Down Payment
- Custom goals

## 6. Analytics

### Features

- Time-range based analysis (1M, 3M, 6M, 1Y, Custom)
- Income vs Expense trends
- Category-wise breakdown
- Monthly comparison charts
- Year-over-Year analysis
- AI-based expense predictions
- Spending pattern insights

### AI Features

- **Expense Prediction**: Uses historical data and linear regression
- **Anomaly Detection**: Identifies unusual transactions using statistical methods
- **Budget Recommendations**: Suggests optimal budget allocations

## 7. Bills Management

### Features

- Track recurring bills (utilities, subscriptions, rent)
- Calendar view of due dates
- Year view with all bills
- Payment status tracking
- Upcoming bills notifications
- Frequency management (Weekly, Monthly, Quarterly, Yearly)
- Auto-reminder system

### Views

- List View: All bills with details
- Calendar View: Bills by date
- Year View: Annual bill overview

## 8. Investment Tracking

### Features

- Portfolio management
- Real-time P&L calculation
- Stock price tracking
- Diversification analysis
- Performance metrics
- Market simulator for realistic experience
- Gain/Loss visualization

### Supported Investment Types

- Stocks
- Mutual Funds
- ETFs
- Bonds
- Cryptocurrencies

## 9. Professional Export System

### PDF Exports

**Features:**

- Professional cover pages with branding
- Executive summary tables
- Embedded high-quality charts
- Section headers with styling
- Page numbering
- Generation timestamp

**Available Reports:**

- Dashboard PDF: Complete financial overview with all charts
- Analytics PDF: Time-range based analysis with trends
- Transactions PDF: Detailed transaction listing

**Charts Included:**

- Monthly Trends (Line chart)
- Category Breakdown (Pie chart)
- Budget Performance (Bar chart)

### Excel Exports

**Features:**

- Multiple sheets for organized data
- Native interactive charts
- Professional styling (headers, colors, fonts)
- Currency formatting (₹ symbol)
- Auto-sized columns
- Frozen header rows
- Formula support

**Available Reports:**

- Dashboard Excel: Summary, Transactions, Budgets, Goals sheets
- Analytics Excel: Trends and detailed data
- Transactions Excel: Complete transaction history

**Excel Charts:**

- Native line charts for trends
- Pie charts for category breakdown
- Interactive and editable

### CSV Exports

**Features:**

- Simple data export for portability
- Import into other tools
- Lightweight and fast

## 10. Performance Features

### Optimization Techniques

- **Caching**: Spring Cache for dashboard data
- **Database Indexing**: On frequently queried columns
- **Pagination**: For large transaction lists
- **Lazy Loading**: For related entities
- **Query Optimization**: Custom JPA queries with joins

### Performance Metrics

- API Response Time: < 200ms average
- Dashboard Load: 1.2 seconds
- Large Dataset Handling: 800ms for 10,000 transactions
- Concurrent Users: 100+ without degradation

## 11. Notifications (Planned)

### Future Features

- Email notifications for budget alerts
- Bill due date reminders
- Goal achievement celebrations
- Transaction anomaly alerts
- Weekly/monthly summary emails
- Investment performance updates

## 12. Data Security

### Security Measures

- HTTPS encryption
- Password hashing (BCrypt)
- JWT token expiration
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting

## 13. Responsive Design

### Supported Devices

- Desktop (1920x1080+)
- Laptop (1366x768+)
- Tablet (768x1024)
- Mobile (375x667+)

### Responsive Features

- Adaptive layouts
- Touch-friendly controls
- Mobile navigation drawer
- Responsive charts
- Optimized images

---

## Technology Stack Summary

**Backend:**

- Spring Boot 3.2
- Spring Security
- Spring Data JPA
- MySQL
- JWT (jjwt)
- iText 7 (PDF)
- Apache POI (Excel)
- JFreeChart (Charts)

**Frontend:**

- React 18
- Material-UI 5
- Recharts
- Axios
- React Router
- Vite

---

*For detailed implementation information, refer to [INTERNSHIP_REPORT.md](INTERNSHIP_REPORT.md)*

