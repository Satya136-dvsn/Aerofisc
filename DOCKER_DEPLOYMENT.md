# BudgetWise Docker Deployment Guide

## Prerequisites

- Docker Desktop installed (<https://www.docker.com/products/docker-desktop>)
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Setup Environment Variables

Copy the example environment file and customize it:

```bash
cp .env.example .env
```

Edit `.env` and set your own passwords and secrets:

- `MYSQL_ROOT_PASSWORD` - Strong password for MySQL root
- `MYSQL_PASSWORD` - Password for budgetwise_user  
- `JWT_SECRET` - Long random string for JWT tokens (256+ bits)
- `CORS_ORIGINS` - Your frontend domain(s)

### 2. Build and Start All Services

```bash
# Build and start all containers
docker-compose up -d --build

# Check if all containers are running
docker-compose ps
```

### 3. Access the Application

- **Frontend**: <http://localhost>
- **Backend API**: <http://localhost:8080>
- **Swagger UI**: <http://localhost:8080/swagger-ui.html>
- **MySQL**: localhost:3307 (external access)

### 4. Default Credentials

Use the credentials you set up during registration, or:

- User: `test@example.com` / `password@123`
- Admin: `superadmin@example.com` / `password@123`

## Docker Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Stop Services

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (WARNING: Deletes database!)
docker-compose down -v
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuild After Code Changes

```bash
# Rebuild and restart backend
docker-compose up -d --build backend

# Rebuild and restart frontend
docker-compose up -d --build frontend
```

## Database Management

### Access MySQL Container

```bash
docker-compose exec mysql mysql -u root -p
# Enter MYSQL_ROOT_PASSWORD when prompted
```

### Backup Database

```bash
# Create backup
docker-compose exec mysql mysqldump -u root -p budgetwise > backup.sql

# Restore backup
docker-compose exec -T mysql mysql -u root -p budgetwise < backup.sql
```

### Migrate Existing Data

If you have existing data in local MySQL:

```bash
# Export from local MySQL
mysqldump -u root -p budgetwise > local_backup.sql

# Import to Docker MySQL
docker-compose exec -T mysql mysql -u root -p budgetwise < local_backup.sql
```

## Production Deployment

### Cloud Platforms

**AWS (EC2/ECS):**

```bash
# Install Docker on EC2
sudo yum install docker
sudo service docker start

# Clone repo and deploy
git clone your-repo
cd budgetwise-tracker
cp .env.example .env
# Edit .env with production values
docker-compose up -d
```

**DigitalOcean (Droplet):**

```bash
# SSH to droplet
ssh root@your-droplet-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Deploy
git clone your-repo
cd budgetwise-tracker
docker-compose up -d
```

**Google Cloud (Cloud Run):**

- Use individual Dockerfiles to deploy each service
- Cloud SQL for MySQL database

### SSL/HTTPS Setup

Add Nginx reverse proxy with Let's Encrypt:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `SuperSecret123!` |
| `MYSQL_DATABASE` | Database name | `budgetwise` |
| `MYSQL_USER` | Application DB user | `budgetwise_user` |
| `MYSQL_PASSWORD` | Application DB password | `DbPass123!` |
| `JWT_SECRET` | JWT signing secret | `long-random-string-256-bits` |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost,https://app.com` |
| `OPENAI_API_KEY` | OpenAI API key (optional) | `sk-...` |

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Check container status
docker-compose ps
```

### Database Connection Failed

```bash
# Verify MySQL is healthy
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Wait for MySQL to fully start (can take 30-60 seconds on first run)
```

### Port Already in Use

```bash
# Change ports in docker-compose.yml
# For example, change "80:80" to "8081:80" for frontend
```

### Reset Everything

```bash
# Stop and remove everything
docker-compose down -v

# Rebuild from scratch
docker-compose up -d --build
```

## Monitoring

### Container Health Status

```bash
# Check health of all containers
docker-compose ps

# Detailed health check
docker inspect budgetwise-backend | grep -A 10 Health
```

### Resource Usage

```bash
# View resource usage
docker stats
```

## Scaling (Advanced)

```bash
# Run multiple backend instances
docker-compose up -d --scale backend=3

# Requires load balancer configuration
```

## Security Best Practices

1. **Change all default passwords** in `.env`
2. **Use strong JWT_SECRET** (minimum 256 bits)
3. **Enable firewall** on production servers
4. **Use HTTPS** in production
5. **Regularly update** Docker images:

   ```bash
   docker-compose pull
   docker-compose up -d
   ```

6. **Backup database** regularly
7. **Monitor logs** for suspicious activity

## Support

For issues or questions:

- Check logs: `docker-compose logs -f`
- Verify environment variables in `.env`
- Ensure ports are not in use
- Check Docker Desktop is running

---

**Happy Deploying! 🚀**
