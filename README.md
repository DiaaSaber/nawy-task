# Nawy Task - Monorepo

A monorepo containing a server and client application with Docker support.

## Project Structure

```
nawy-task/
├── server/          # Node.js + TypeScript + Express + Sequelize + PostgreSQL + Swagger
├── client/          # Next.js + Tailwind CSS
└── docker-compose.yml
```

## Tech Stack

### Server
- Node.js
- TypeScript
- Express.js
- Sequelize ORM
- PostgreSQL
- Swagger/OpenAPI

### Client
- Next.js 15
- TypeScript
- Tailwind CSS

## Getting Started

### Prerequisites
- Docker
- Docker Compose

### Running the Application

Start all services with a single command:

```bash
docker compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Server API on port 3001
- Client application on port 3000

### Accessing the Application

- **Client**: http://localhost:3000
- **Server API**: http://localhost:3001
- **API Documentation (Swagger)**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

## Development

### Server Development

```bash
cd server
npm install
npm run dev
```

### Client Development

```bash
cd client
npm install
npm run dev
```

## API Endpoints

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `GET /health` - Health check endpoint

## Environment Variables

### Server
Create a `.env` file in the `server` directory (see `.env.example`):

```
PORT=3001
DB_HOST=db
DB_PORT=5432
DB_NAME=nawy_db
DB_USER=postgres
DB_PASSWORD=postgres
```

## Docker Commands

```bash
# Start services
docker compose up --build

# Stop services
docker compose down

# View logs
docker compose logs -f

# Rebuild specific service
docker compose build server
docker compose build client
```