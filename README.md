# 🎬 Movie Ticket Booking Web App with Automated DevOps Pipeline

A full-stack web application for managing movie ticket bookings with separate admin and customer interfaces. Built with modern technologies and deployed using Docker on Azure infrastructure.

![Tech Stack](https://img.shields.io/badge/React-18-blue)
![.NET](https://img.shields.io/badge/.NET-8.0-purple)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![Azure](https://img.shields.io/badge/Azure-Cloud-0078D4)

## 🌟 Live Demo

- **Customer Portal:** http://20.212.19.81
- **Demo Video:** https://bit.ly/4awRIKz
  
## ✨ Features

### Customer Features
- 🎭 **Browse Movies:** View all available movies with showtimes
- 🎫 **Book Tickets:** Select date, showtime, and number of seats
- 💳 **Payment Management:** Track booking status (Pending/Paid/Cancelled)
- 👤 **User Profile:** Manage personal information and profile picture
- 📱 **Responsive Design:** Mobile-friendly interface

### Admin Features
- 👥 **User Management:** View, edit roles, and delete users
- 🎬 **Movie Management:** Add, edit, and delete movies with images
- 🕐 **Showtime Management:** Configure multiple showtimes per movie
- 📊 **Booking Dashboard:** View all bookings with customer details
- 💰 **Revenue Tracking:** Monitor payment status and total revenue

### Authentication & Authorization
- 🔐 JWT-based authentication
- 🛡️ Role-based access control (Admin/Customer)
- 🔑 Secure password hashing
- 🚫 Protected routes and API endpoints

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Build Tool:** Vite

### Backend
- **Framework:** ASP.NET Core 8.0
- **ORM:** Entity Framework Core
- **Database:** Azure SQL Database
- **Authentication:** JWT Bearer Tokens
- **API:** RESTful API

### DevOps & Infrastructure
- **Containerization:** Docker, Docker Compose
- **Web Server:** Nginx (Reverse Proxy)
- **CI/CD:** GitHub Actions
- **Cloud Platform:** Microsoft Azure
  - Azure Virtual Machine (Ubuntu 24.04)
  - Azure SQL Database (Basic Tier)
- **Version Control:** Git, GitHub

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **.NET SDK 8.0**
- **Docker** and **Docker Compose**
- **Git**
- **Azure Account** (for deployment)

### Local Development Setup

#### 1. Clone Repository
```bash
https://github.com/KanchanaKoralage1/ASP.NET_with_React.git
cd ASP.NET_with_React
```

#### 2. Backend Setup
```bash
cd Backend/Backend

# Restore NuGet packages
dotnet restore

# Create appsettings.json from template
cp appsettings.template.json appsettings.json

# Update appsettings.json with your Azure SQL connection string
# Edit: ConnectionStrings.DefaultConnection

# Apply database migrations
dotnet ef database update

# Run backend
dotnet run
```

Backend will start on: `http://localhost:5175`

#### 3. Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Create .env.development
echo "VITE_API_URL=http://localhost:5175" > .env.development

# Run frontend
npm run dev
```

Frontend will start on: `http://localhost:5173`

#### 4. Test Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5175/api/movie/allmovies

## ⚙️ Environment Setup

### Backend Configuration

**Create:** `Backend/Backend/appsettings.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_AZURE_SQL_CONNECTION_STRING"
  },
  "JwtSettings": {
    "SecretKey": "YOUR_32_CHARACTER_SECRET_KEY",
    "Issuer": "MovieTicketApp",
    "Audience": "MovieTicketApp",
    "ExpiryInMinutes": "60"
  }
}
```

### Frontend Configuration

**Development:** `.env.development`
```env
VITE_API_URL=http://localhost:5173
```

**Production:** `.env.production`
```env
VITE_API_URL=
```
*(Empty for production - uses Nginx reverse proxy)*

### Docker Configuration

**Create:** `.env` (in project root, for Docker Compose)
```env
CONNECTION_STRING=YOUR_AZURE_SQL_CONNECTION_STRING
```

⚠️ **Never commit this file to Git!**

## 🐳 Docker Deployment

### Build and Run with Docker Compose
```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Individual Container Commands
```bash
# Backend only
docker-compose up -d backend

# Frontend only
docker-compose up -d frontend

# Restart specific service
docker-compose restart backend
```

## 🌐 Azure Deployment

### Infrastructure Setup

1. **Create Azure VM**
   - OS: Ubuntu 24.04 LTS
   - Size: B1s (1 vCPU, 1GB RAM)
   - SSH Authentication
   - Open Ports: 22, 80, 5000

2. **Create Azure SQL Database**
   - Tier: Basic (~$5/month)
   - Configure firewall rules (allow VM IP)
   - Note connection string

3. **SSH to VM and Install Docker**
```bash
# Connect to VM
ssh azureuser@YOUR_VM_IP

# Install Docker
sudo apt update
sudo apt install -y docker.io docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

4. **Clone Repository on VM**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add public key to GitHub
cat ~/.ssh/id_ed25519.pub

# Clone repo
https://github.com/KanchanaKoralage1/ASP.NET_with_React.git
cd ASP.NET_with_React
```

5. **Create .env File on VM**
```bash
nano .env
# Add: CONNECTION_STRING=your_connection_string
```

6. **Deploy Application**
```bash
docker-compose up -d --build
```

### Automated CI/CD with GitHub Actions

**Setup GitHub Secrets:**

1. Repository → Settings → Secrets and variables → Actions
2. Add secrets:
   - `VM_SSH_PRIVATE_KEY`: Your SSH private key
   - `DB_CONNECTION_STRING`: Azure SQL connection string

**Workflow automatically:**
- Triggers on push to `main` branch
- SSHs to Azure VM
- Pulls latest code
- Creates `.env` file from secrets
- Rebuilds Docker containers
- Deploys to production

## 🔄 DevOps Pipeline

### Continuous Integration/Continuous Deployment

**Workflow Process:**

1. **Developer pushes code** to `main` branch
2. **GitHub Actions triggers** deployment workflow
3. **SSH connection** established to Azure VM
4. **Latest code pulled** from repository
5. **Environment file created** from GitHub Secrets
6. **Docker images rebuilt** with latest changes
7. **Containers restarted** with zero downtime
8. **Health checks** verify successful deployment

**Deployment Time:** ~2-3 minutes

### Manual Deployment
```bash
# SSH to VM
ssh azureuser@YOUR_VM_IP

# Navigate to project
cd ~/ASP.NET_with_React

# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## 🔐 Security

### Implemented Security Measures

- ✅ **JWT Authentication:** Secure token-based auth
- ✅ **Password Hashing:** BCrypt password encryption
- ✅ **Role-Based Authorization:** Admin/Customer separation
- ✅ **SQL Injection Protection:** Parameterized queries via EF Core
- ✅ **CORS Configuration:** Restricted cross-origin requests
- ✅ **HTTPS Ready:** SSL/TLS encryption (configurable)
- ✅ **Environment Variables:** Secrets not in source code
- ✅ **SSH Key Authentication:** Secure VM access
- ✅ **Azure SQL Firewall:** IP-based access control
- ✅ **Docker Network Isolation:** Containers on private network

## 👨‍💻 Author

**Kanchana Koralage**
- GitHub: https://github.com/KanchanaKoralage1
- LinkedIn: https://www.linkedin.com/in/kanchana-koralage/
- Email: itsmekanchanakoralage@gmail.com


## 🙏 Acknowledgments

- React and .NET communities
- Tailwind CSS for styling framework
- Lucide React for icons
- Microsoft Azure for cloud infrastructure
- Docker for containerization
- GitHub for CI/CD platform
