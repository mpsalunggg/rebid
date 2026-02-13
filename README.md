# Rebid App

Backend auction service built in Go, designed to handle online auctions, bids, and related listing operations. Exposes RESTful APIs using PostgreSQL as the database.

## Tech Stack

- **Language:** Go
- **Database:** PostgreSQL
- **Auth:** JWT (HS256)
- **Migrations:** golang-migrate/migrate v4
- **Dev:** Air (hot reload), Docker Compose

## Getting Started

### 1. Clone and configure

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 2. Start PostgreSQL

```bash
make docker-up
```

### 3. Run migrations

```bash
make migrate-up
```

### 4. Run the application

```bash
# With hot reload
make air

# Or standard run
make run
```

The server starts at `http://localhost:8080`.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `8080` |
| `HOST` | Server host | `localhost` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | Database user | `rebid_user` |
| `DB_PASSWORD` | Database password | `rebid_password` |
| `DB_NAME` | Database name | `rebid_db` |
| `DB_SSLMODE` | SSL mode | `disable` |
| `JWT_SECRET` | JWT signing secret | _(required)_ |
| `JWT_EXPIRY_HOURS` | Token expiry in hours | `24` |
| `UPLOAD_DIR` | File upload directory | `./uploads` |
| `BASE_URL` | Base URL for file URLs | `http://localhost:8080` |

## Makefile Commands

```bash
make build            # Build binary
make run              # Run application
make air              # Run with hot reload
make docker-up        # Start PostgreSQL container
make docker-down      # Stop PostgreSQL container
make migrate-up       # Run all migrations
make migrate-down     # Rollback last migration
make migrate-create NAME=migration_name  # Create new migration
make seed             # Run database seeders
make install-deps     # Download Go dependencies
make clean            # Remove build artifacts
```

## Project Structure

```
rebid/
├── cmd/app/            # Entry point
├── internal/
│   ├── config/         # Configuration
│   ├── databases/      # Migrations & seeders
│   ├── dto/            # Request/response structs
│   ├── handlers/       # HTTP handlers
│   ├── middleware/     # Auth middleware
│   ├── models/         # Database models
│   ├── repositories/   # Data access layer
│   ├── routes/         # Route definitions
│   └── services/       # Business logic
└── pkg/                # Shared utilities (jwt, password, response)
```
