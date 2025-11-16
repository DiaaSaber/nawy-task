# Nawy Apartments - Full Stack Application

A production-ready apartments listing application built with modern web technologies. This monorepo contains a RESTful API backend and a responsive Next.js frontend, fully containerized with Docker.

## 🚀 Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **Sequelize ORM** - Database modeling
- **PostgreSQL** - Relational database
- **Swagger/OpenAPI** - API documentation

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client

## ⚡ Quick Start

### Prerequisites
- **Docker** and **Docker Compose** installed
- No other setup required!

### Running the Application (First Time)

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd nawy-task
   ```

2. **Start all services** with a single command:
   ```bash
   docker compose up --build
   ```

   This will:
   - Build the frontend and backend Docker images
   - Start PostgreSQL database
   - Run database migrations and seed 5 sample apartments
   - Start the backend API server
   - Start the Next.js frontend server

3. **Access the application**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:4000/api
   - **API Documentation**: http://localhost:4000/api/docs

That's it! The application is now running with sample data.

## 📍 Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application UI |
| Backend API | http://localhost:4000/api | RESTful API endpoints |
| Swagger Docs | http://localhost:4000/api/docs | Interactive API documentation |
| Health Check | http://localhost:4000/api/health | API health status |
| PostgreSQL | localhost:5432 | Database (credentials in docker-compose.yml) |

## 🎯 Backend API Endpoints

### Health
- `GET /api/health` - Health check

### Apartments
- `GET /api/apartments` - List apartments with filtering, sorting, and pagination
  - Query params: `search`, `min_price`, `max_price`, `sort` (newest/price_asc/price_desc), `page`, `page_size`
- `GET /api/apartments/:id` - Get apartment details by ID
- `POST /api/apartments` - Create a new apartment
  - Required fields: `project`, `unit_name`, `unit_number`, `price`, `area`, `city`
  - Optional fields: `description`, `status` (available/sold/reserved)


## 🖥️ Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | **Main Listings Page** - Browse apartments with search, price filters, sorting, and pagination |
| `/apartments/:id` | **Apartment Details** - View detailed information about a specific apartment |
| `/add` | **Create Apartment** - Form to add a new apartment listing |

### Features
- 🔍 **Search** - Search by project name, unit name, or unit number
- 💰 **Price Filtering** - Filter by minimum and maximum price
- 🔄 **Sorting** - Sort by newest, price (low to high), or price (high to low)
- 📄 **Pagination** - Navigate through multiple pages of results
- ✅ **Form Validation** - Client-side validation with error messages
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🎨 **Material-UI Components** - Professional UI with cards, buttons, and inputs

## 🐳 Docker Commands

```bash
# Start all services (build if needed)
docker compose up --build

# Start services in detached mode (background)
docker compose up -d

# Stop all services
docker compose down

# Stop and remove all data (fresh start)
docker compose down -v

# View logs (all services)
docker compose logs -f

# View logs (specific service)
docker compose logs -f server
docker compose logs -f client

# Rebuild a specific service
docker compose build server
docker compose build client

# Check running containers
docker compose ps
```

## 🗂️ Data Persistence

- **PostgreSQL data** is persisted using Docker volumes
- Stopping and restarting containers preserves all data
- To reset the database, run: `docker compose down -v`

## 🧪 Using the Application

1. **Browse Apartments**: Visit http://localhost:3000
2. **Search & Filter**: Try searching for "Palm" or filtering by price
3. **View Details**: Click "View Details" on any apartment
4. **Create New**: Go to "Add Apartment" in the navigation
5. **API Testing**: Visit http://localhost:4000/api/docs for Swagger UI


### Port already in use
Make sure ports 3000, 4000, and 5432 are not used by other applications.

### Database connection issues
The backend waits for the database to be healthy before starting. Check `docker compose logs db`.
