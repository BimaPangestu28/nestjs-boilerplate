# NX Fullstack Framework Makefile
# Run 'make help' to see all available commands

.PHONY: help install dev build start test lint format clean docker-build docker-run

# Default target
.DEFAULT_GOAL := help

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
BLUE := \033[0;34m
PURPLE := \033[0;35m
CYAN := \033[0;36m
NC := \033[0m # No Color

## Help
help: ## Show this help message
	@echo "$(GREEN)NX Fullstack Framework$(NC)"
	@echo "$(CYAN)Modern plugin-based framework with NestJS + Next.js$(NC)"
	@echo ""
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

## Installation & Setup
install: ## Install all dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm install

setup: install ## Complete setup (install + copy .env)
	@echo "$(GREEN)Setting up project...$(NC)"
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "$(YELLOW)Created .env file from .env.example$(NC)"; \
	else \
		echo "$(YELLOW).env file already exists$(NC)"; \
	fi
	@echo ""
	@echo "$(GREEN)✅ Setup complete!$(NC)"
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  1. Configure your .env file"
	@echo "  2. Run 'make dev' to start development"
	@echo "  3. Visit http://localhost:3000/api (API)"
	@echo "  4. Visit http://localhost:4200 (Admin Dashboard)"

clean: ## Clean node_modules and dist
	@echo "$(GREEN)Cleaning project...$(NC)"
	rm -rf node_modules dist .nx/cache apps/admin/.next coverage

reinstall: clean install ## Clean install dependencies

## Development
dev: ## Start all apps in development mode (API + Admin)
	@echo "$(GREEN)Starting development servers...$(NC)"
	@echo "$(CYAN)API: http://localhost:3000/api$(NC)"
	@echo "$(CYAN)Admin: http://localhost:4200$(NC)"
	@echo "$(CYAN)API Docs: http://localhost:3000/api/docs$(NC)"
	npm run dev

dev-api: ## Start only API server
	@echo "$(GREEN)Starting API server...$(NC)"
	@echo "$(CYAN)API: http://localhost:3000/api$(NC)"
	@echo "$(CYAN)Docs: http://localhost:3000/api/docs$(NC)"
	nx serve api

dev-admin: ## Start only Admin dashboard
	@echo "$(GREEN)Starting Admin dashboard...$(NC)"
	@echo "$(CYAN)Admin: http://localhost:4200$(NC)"
	nx serve admin

## Build & Production
build: ## Build all applications
	@echo "$(GREEN)Building all applications...$(NC)"
	nx build api
	nx build admin

build-api: ## Build API application
	@echo "$(GREEN)Building API...$(NC)"
	nx build api

build-admin: ## Build Admin application
	@echo "$(GREEN)Building Admin...$(NC)"
	nx build admin

start: ## Start production API server
	@echo "$(GREEN)Starting production API server...$(NC)"
	node dist/apps/api/main.js

preview-admin: build-admin ## Preview built admin dashboard
	@echo "$(GREEN)Starting admin preview...$(NC)"
	cd dist/apps/admin && npx serve -s .

## Code Quality
lint: ## Run ESLint on all projects
	@echo "$(GREEN)Running ESLint...$(NC)"
	nx lint

lint-fix: ## Run ESLint with auto-fix
	@echo "$(GREEN)Running ESLint with auto-fix...$(NC)"
	nx run-many --target=lint --all --fix

format: ## Format code with Prettier
	@echo "$(GREEN)Formatting code...$(NC)"
	npx prettier --write .

format-check: ## Check code formatting
	@echo "$(GREEN)Checking code formatting...$(NC)"
	npx prettier --check .

quality: lint format ## Run all code quality checks

## Testing
test: ## Run all tests
	@echo "$(GREEN)Running all tests...$(NC)"
	nx test

test-api: ## Run API tests
	@echo "$(GREEN)Running API tests...$(NC)"
	nx test api

test-admin: ## Run Admin tests
	@echo "$(GREEN)Running Admin tests...$(NC)"
	nx test admin

test-watch: ## Run tests in watch mode
	@echo "$(GREEN)Running tests in watch mode...$(NC)"
	nx test --watch

test-coverage: ## Run tests with coverage
	@echo "$(GREEN)Running tests with coverage...$(NC)"
	nx test --coverage

## NX Commands
nx-graph: ## Show NX dependency graph
	@echo "$(GREEN)Opening NX dependency graph...$(NC)"
	nx graph

nx-affected: ## Show affected projects
	@echo "$(GREEN)Showing affected projects...$(NC)"
	nx affected:graph

nx-cache: ## Show NX cache status
	@echo "$(GREEN)NX cache status:$(NC)"
	nx show projects

nx-reset: ## Reset NX cache
	@echo "$(GREEN)Resetting NX cache...$(NC)"
	nx reset

## Plugin System
plugin-create: ## Create a new plugin template
	@echo "$(GREEN)Creating new plugin...$(NC)"
	@read -p "Plugin name: " name; \
	mkdir -p plugins/$$name; \
	echo "$(YELLOW)Plugin $$name created in plugins/$$name$(NC)"

plugin-list: ## List all installed plugins
	@echo "$(GREEN)Installed plugins:$(NC)"
	@if [ -d "plugins" ]; then \
		find plugins -maxdepth 1 -type d ! -path plugins | sed 's|plugins/||'; \
	else \
		echo "$(YELLOW)No plugins directory found$(NC)"; \
	fi

plugin-clean: ## Clean unused plugins
	@echo "$(GREEN)Cleaning unused plugins...$(NC)"
	@find plugins -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

## Database
db-generate: ## Generate database schema
	@echo "$(GREEN)Generating database schema...$(NC)"
	@if [ -f "prisma/schema.prisma" ]; then \
		npx prisma generate; \
	else \
		echo "$(YELLOW)No Prisma schema found$(NC)"; \
	fi

db-migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(NC)"
	@if [ -f "prisma/schema.prisma" ]; then \
		npx prisma migrate dev; \
	else \
		echo "$(YELLOW)No Prisma schema found$(NC)"; \
	fi

db-reset: ## Reset database
	@echo "$(GREEN)Resetting database...$(NC)"
	@if [ -f "prisma/schema.prisma" ]; then \
		npx prisma migrate reset; \
	else \
		echo "$(YELLOW)No Prisma schema found$(NC)"; \
	fi

db-studio: ## Open Prisma Studio
	@echo "$(GREEN)Opening Prisma Studio...$(NC)"
	@if [ -f "prisma/schema.prisma" ]; then \
		npx prisma studio; \
	else \
		echo "$(YELLOW)No Prisma schema found$(NC)"; \
	fi

## Docker Commands
docker-build: ## Build Docker images for all apps
	@echo "$(GREEN)Building Docker images...$(NC)"
	docker build -f apps/api/Dockerfile -t nx-fullstack-api .
	docker build -f apps/admin/Dockerfile -t nx-fullstack-admin .

docker-build-api: ## Build Docker image for API
	@echo "$(GREEN)Building API Docker image...$(NC)"
	docker build -f apps/api/Dockerfile -t nx-fullstack-api .

docker-build-admin: ## Build Docker image for Admin
	@echo "$(GREEN)Building Admin Docker image...$(NC)"
	docker build -f apps/admin/Dockerfile -t nx-fullstack-admin .

docker-run: ## Run Docker containers
	@echo "$(GREEN)Starting Docker containers...$(NC)"
	docker-compose up -d

docker-dev: ## Run Docker containers in development mode
	@echo "$(GREEN)Starting Docker containers in development mode...$(NC)"
	docker-compose -f docker-compose.dev.yml up

docker-stop: ## Stop Docker containers
	@echo "$(GREEN)Stopping Docker containers...$(NC)"
	docker-compose down

docker-logs: ## Show Docker container logs
	@echo "$(GREEN)Showing Docker logs...$(NC)"
	docker-compose logs -f

docker-clean: ## Clean Docker images and containers
	@echo "$(GREEN)Cleaning Docker images and containers...$(NC)"
	docker system prune -f

## Monitoring & Health
health: ## Check application health
	@echo "$(GREEN)Checking application health...$(NC)"
	@curl -s http://localhost:3000/api/health | jq . || echo "$(RED)API not running or jq not installed$(NC)"

logs: ## Show application logs (if available)
	@echo "$(GREEN)Showing application logs...$(NC)"
	@if [ -d "logs" ]; then \
		tail -f logs/combined.log; \
	else \
		echo "$(YELLOW)No logs directory found$(NC)"; \
	fi

logs-error: ## Show error logs only
	@echo "$(GREEN)Showing error logs...$(NC)"
	@if [ -f "logs/error.log" ]; then \
		tail -f logs/error.log; \
	else \
		echo "$(YELLOW)No error logs found$(NC)"; \
	fi

## Project Status & Info
status: ## Show project status and information
	@echo "$(GREEN)Project Status:$(NC)"
	@echo "$(CYAN)Framework:$(NC) NX Fullstack Framework"
	@echo "$(CYAN)Node version:$(NC) $$(node --version)"
	@echo "$(CYAN)NPM version:$(NC) $$(npm --version)"
	@echo "$(CYAN)NX version:$(NC) $$(npx nx --version)"
	@echo ""
	@echo "$(CYAN)Environment:$(NC) $$([ -f .env ] && echo "✅ Configured" || echo "❌ Not configured")"
	@echo "$(CYAN)Dependencies:$(NC) $$([ -d node_modules ] && echo "✅ Installed" || echo "❌ Not installed")"
	@echo ""
	@echo "$(CYAN)Applications:$(NC)"
	@echo "  • API (NestJS): apps/api"
	@echo "  • Admin (Next.js): apps/admin"
	@echo ""
	@echo "$(CYAN)Libraries:$(NC)"
	@echo "  • Plugin Core: libs/plugins/core"
	@echo "  • Shared Types: libs/shared/types"
	@echo "  • Shared Utils: libs/shared/utils"
	@echo ""
	@echo "$(CYAN)Installed Plugins:$(NC)"
	@if [ -d "plugins" ]; then \
		find plugins -maxdepth 1 -type d ! -path plugins | sed 's|plugins/|  • |' || echo "  No plugins installed"; \
	else \
		echo "  No plugins directory found"; \
	fi

info: status ## Alias for status

## Release & Deployment
version: ## Show current version
	@echo "$(GREEN)Current version:$(NC) $$(node -p "require('./package.json').version")"

version-patch: ## Bump patch version
	@echo "$(GREEN)Bumping patch version...$(NC)"
	npm version patch

version-minor: ## Bump minor version
	@echo "$(GREEN)Bumping minor version...$(NC)"
	npm version minor

version-major: ## Bump major version
	@echo "$(GREEN)Bumping major version...$(NC)"
	npm version major

## Quick Development Workflow
quick-start: setup dev ## Quick start: setup + dev
	@echo "$(GREEN)Quick start completed!$(NC)"

workflow: clean install quality test build ## Complete development workflow
	@echo "$(GREEN)Development workflow completed!$(NC)"

ci: install lint test build ## CI/CD workflow
	@echo "$(GREEN)CI workflow completed!$(NC)"

## Aliases for common commands
s: start ## Alias for start
d: dev ## Alias for dev
b: build ## Alias for build
t: test ## Alias for test
l: lint ## Alias for lint
f: format ## Alias for format
c: clean ## Alias for clean
h: help ## Alias for help