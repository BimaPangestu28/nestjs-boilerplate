# NX Fullstack Framework

A modern, plugin-based full-stack framework built with NX monorepo, NestJS, and Next.js. Create powerful applications with extensible plugin architecture, similar to WordPress or Strapi.

## 🚀 Features

- **🏗️ NX Monorepo**: Scalable development with multiple apps and shared libraries
- **🔌 Plugin System**: Extensible architecture with hot-swappable plugins
- **📊 Admin Dashboard**: Beautiful Next.js admin interface
- **🔄 API First**: Robust NestJS API with auto-generated documentation
- **🎯 Type Safety**: Full TypeScript support across the stack
- **📦 Plugin Marketplace**: Browse and install plugins like WordPress/Strapi
- **🔧 CLI Tools**: Powerful command-line tools for development

## 🏗️ Architecture

```
workspace/
├── apps/
│   ├── api/                 # NestJS API Server
│   └── admin/               # Next.js Admin Dashboard
├── libs/
│   ├── plugins/core/        # Plugin system core
│   ├── shared/              # Shared utilities & types
│   └── database/            # Database schemas
├── plugins/                 # Plugin directory
└── tools/                   # CLI and build tools
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development (API + Admin)
npm run dev

# Or start individually
npm run start        # API server (localhost:3000)
nx serve admin       # Admin dashboard (localhost:4200)
```

## 🔌 Plugin System

### Installing Plugins

```bash
# Browse marketplace
npm run plugin search

# Install a plugin
npm run plugin install authentication
npm run plugin install ecommerce

# List installed plugins
npm run plugin list
```

### Creating Plugins

```typescript
// plugins/my-plugin/index.ts
import { Plugin, Hook, OnEvent } from '@nx-fullstack/plugins/core';

@Plugin({
  name: 'my-plugin',
  version: '1.0.0',
  description: 'My awesome plugin',
  author: 'Your Name'
})
export class MyPlugin {
  @Hook('user.beforeCreate', 10)
  async beforeUserCreate(userData: any) {
    // Modify user data before creation
    return userData;
  }

  @OnEvent('user.created')
  async onUserCreated(event: any) {
    // Handle user created event
    console.log('User created:', event.data);
  }

  async onLoad(api: PluginAPI) {
    // Plugin initialization
    console.log('Plugin loaded!');
  }
}
```

## 📊 Admin Dashboard

The admin dashboard provides:

- **Plugin Management**: Install, configure, and manage plugins
- **System Monitoring**: Health checks, performance metrics
- **API Documentation**: Interactive Swagger UI
- **Configuration**: Environment and plugin settings

Visit `http://localhost:4200` after starting the admin app.

## 🔌 Available Plugins

### Official Plugins (Free)
- **Authentication** - JWT auth with RBAC
- **Media Manager** - File upload & processing
- **Email Marketing** - Campaigns & automation

### Community Plugins
- **E-commerce** - Complete shopping solution ($99)
- **Analytics** - Advanced reporting ($49)
- **CRM** - Customer relationship management ($79)

## 🛠️ Development

### Project Commands

```bash
# Build all apps
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Plugin management
npm run plugin <command>
```

### NX Commands

```bash
# Generate new app
nx g @nx/nest:app my-api
nx g @nx/next:app my-admin

# Generate library
nx g @nx/js:lib my-lib

# Run specific app
nx serve api
nx serve admin

# Build specific project
nx build api
nx build admin

# Test specific project
nx test api
nx test admin
```

## 🔧 Plugin Development

### Plugin Structure

```
plugins/my-plugin/
├── package.json
├── index.ts
├── README.md
└── config/
    └── schema.json
```

### Plugin Hooks

Available hooks for extending functionality:

```typescript
// User management
user.beforeCreate
user.afterCreate
user.beforeUpdate
user.afterUpdate
user.beforeDelete
user.afterDelete

// Content management
content.beforeSave
content.afterSave
content.beforeRender
content.afterRender

// API hooks
api.beforeRequest
api.afterRequest
api.beforeResponse
api.afterResponse
```

### Plugin Events

Listen to system events:

```typescript
// System events
system.startup
system.shutdown
plugin.installed
plugin.uninstalled

// User events
user.login
user.logout
user.passwordReset

// Content events
content.published
content.updated
content.deleted
```

## 🗄️ Database

The framework supports multiple databases:

- SQLite (default for development)
- PostgreSQL (recommended for production)
- MySQL/MariaDB
- MongoDB (via Mongoose)

Configure in your environment:

```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=myuser
DB_PASSWORD=mypass
DB_DATABASE=myapp
```

## 🚀 Deployment

### Using Docker

```bash
# Build production images
docker build -f apps/api/Dockerfile -t my-app-api .
docker build -f apps/admin/Dockerfile -t my-app-admin .

# Run with docker-compose
docker-compose up -d
```

### Traditional Deployment

```bash
# Build for production
npm run build

# Start API server
node dist/apps/api/main.js

# Serve admin (static)
# Upload dist/apps/admin to your static hosting
```

## 📚 Documentation

- [Plugin Development Guide](./docs/plugin-development.md)
- [API Reference](./docs/api-reference.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing](./docs/contributing.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Roadmap

- [ ] Plugin Hot Reload
- [ ] GraphQL API Option
- [ ] Mobile Admin App (React Native)
- [ ] Plugin Marketplace UI
- [ ] Multi-tenant Support
- [ ] Real-time Collaboration
- [ ] Workflow Engine
- [ ] Advanced Analytics

---

**Built with ❤️ using NX, NestJS, and Next.js**