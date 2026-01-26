.PHONY: help build run migrate-up migrate-down migrate-create migrate-create-up migrate-create-down seed clean docker-up docker-down install-deps

# Database connection string
DB_URL = postgresql://rebid_user:rebid_password@localhost:5432/rebid_db?sslmode=disable

help: ## Show help
	@echo 'Available commands:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  make %-20s %s\n", $$1, $$2}'

docker-up: ## Start PostgreSQL
	docker compose up -d
	@sleep 3

docker-down: ## Stop PostgreSQL
	docker compose down

migrate-create: ## Create migration (usage: make migrate-create NAME=create_users)
	@if [ -z "$(NAME)" ]; then \
		echo "❌ Error: NAME required. Example: make migrate-create NAME=create_users"; \
		exit 1; \
	fi
	@go run -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest create -ext sql -dir ./databases/migration -seq $(NAME)
	@echo "✅ Migration created: migration/*_$(NAME).sql"

migrate-create-up: ## Create UP migration only (usage: make migrate-create-up NAME=create_users)
	@if [ -z "$(NAME)" ]; then \
		echo "❌ Error: NAME required. Example: make migrate-create-up NAME=create_users"; \
		exit 1; \
	fi
	@LAST_SEQ=$$(ls -1 ./databases/migration/*.sql 2>/dev/null | sed 's/.*\/\([0-9]*\)_.*/\1/' | sort -n | tail -1); \
	NEXT_SEQ=$$(printf "%06d" $$((10#$${LAST_SEQ:-0} + 1))); \
	touch "./databases/migration/$${NEXT_SEQ}_$(NAME).up.sql"; \
	echo "✅ UP Migration created: databases/migration/$${NEXT_SEQ}_$(NAME).up.sql"

migrate-create-down: ## Create DOWN migration only (usage: make migrate-create-down NAME=create_users)
	@if [ -z "$(NAME)" ]; then \
		echo "❌ Error: NAME required. Example: make migrate-create-down NAME=create_users"; \
		exit 1; \
	fi
	@UP_FILE=$$(ls -1 ./databases/migration/*_$(NAME).up.sql 2>/dev/null | head -1); \
	if [ -z "$$UP_FILE" ]; then \
		echo "❌ Error: UP migration for '$(NAME)' not found"; \
		exit 1; \
	fi; \
	DOWN_FILE=$$(echo "$$UP_FILE" | sed 's/.up.sql/.down.sql/'); \
	if [ -f "$$DOWN_FILE" ]; then \
		echo "⚠️  DOWN migration already exists: $$DOWN_FILE"; \
		exit 1; \
	fi; \
	touch "$$DOWN_FILE"; \
	echo "✅ DOWN Migration created: $$DOWN_FILE"

migrate-up: ## Run migrations
	@go run -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest -path ./databases/migration -database "$(DB_URL)" up

migrate-down: ## Rollback last migration
	@go run -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest -path ./databases/migration -database "$(DB_URL)" down 1

migrate-force: ## Force migration version (usage: make migrate-force VERSION=3)
	@if [ -z "$(VERSION)" ]; then \
		echo "❌ Error: VERSION required. Example: make migrate-force VERSION=3"; \
		exit 1; \
	fi
	@go run -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest -path ./databases/migration -database "$(DB_URL)" force $(VERSION)

seed: ## Run seeders
	@go run ./cmd/app seed

build: ## Build app
	@go build -o bin/rebid ./cmd/app/

run: ## Run app
	@go run ./cmd/app/

air: ## Run auto reload
	@air

clean: ## Clean build files
	@rm -rf bin/

install-deps: ## Install dependencies
	@go mod download
	@go mod tidy