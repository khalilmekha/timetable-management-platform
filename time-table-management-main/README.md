# Time Table Management System - Backend API

A comprehensive backend application for managing academic time tables, built with modern technologies and following best practices for scalability, maintainability, and performance.

## 🏗️ Architecture Overview

This backend follows a **modular, layered architecture** with clear separation of concerns:

```
src/
├── modules/           # Feature-based modules (User, Teacher, Course, etc.)
├── shared/           # Shared utilities and middleware
├── database/         # Database configuration and utilities
├── utils/            # Common utilities
├── types/            # TypeScript type definitions
├── configs/          # Application configuration
└── components/       # Reusable components
```

### 🔧 Core Design Patterns

- **Module-Based Architecture**: Each feature (User, Teacher, Course, etc.) is organized as a self-contained module
- **Controller-Service-Repository Pattern**: Clean separation between API layer, business logic, and data access
- **Dependency Injection**: Loose coupling between components
- **Middleware-First**: Extensive use of middleware for cross-cutting concerns

## 🚀 Technology Stack

### **Core Framework & Runtime**

- **Node.js** (≥18.0.0) - JavaScript runtime
- **TypeScript** - Type-safe JavaScript development
- **Express.js** (v5.0.1) - Web application framework

### **Database & ORM**

- **Prisma** (v6.5.0) - Modern database toolkit and ORM
- **PostgreSQL** - Primary database (configurable via `DATABASE_URL`)
- **Redis** (v4.7.0) - Caching and session management

### **Authentication & Security**

- **JWT** (jsonwebtoken v9.0.2) - Stateless authentication
- **bcrypt** (v5.1.1) - Password hashing
- **Helmet** (v8.1.0) - Security headers
- **CORS** (v2.8.5) - Cross-origin resource sharing

### **Validation & Data Processing**

- **Zod** (v3.24.2) - Runtime type validation and parsing
- **Multer** (v1.4.5) - File upload handling

### **Development & Testing**

- **Jest** (v29.7.0) - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server

### **Additional Features**

- **React PDF Renderer** (v4.3.0) - PDF generation for schedules
- **Socket.io** (v4.8.1) - Real-time communication
- **Cloudinary** (v2.6.0) - Cloud-based image management
- **Nodemailer** (v6.10.1) - Email notifications

## 📁 Project Structure

### **Module Organization**

Each module follows a consistent structure:

```
modules/[feature]/
├── [feature].controller.ts    # HTTP request handlers
├── [feature].service.ts       # Business logic
├── [feature].router.ts        # Route definitions
├── [feature].validation.ts    # Zod validation schemas
├── [feature].responses.ts     # Response message constants
└── index.ts                   # Module exports
```

### **Available Modules**

- **👤 User Management** - User CRUD operations, authentication
- **👨‍🏫 Teacher Management** - Teacher profiles, availability, schedules
- **📚 Course Management** - Course creation, assignment to specialities
- **🏫 Classroom Management** - Room booking, availability tracking
- **📋 Section Management** - Student group organization
- **🎓 Speciality Management** - Academic program definitions
- **📅 Season Management** - Academic year management
- **📝 Teacher Complaints** - Issue reporting and resolution
- **🔐 Authentication** - Login, profile management
- **📄 PDF Generation** - Schedule document creation

## 🔌 API Architecture

### **RESTful API Design**

- **Base URL**: `/api/v1/`
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Response Format**: Consistent JSON structure

```typescript
// Success Response
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

### **Middleware Stack**

1. **Morgan** - HTTP request logging
2. **CORS** - Cross-origin resource sharing
3. **Helmet** - Security headers
4. **Express JSON/URL-encoded** - Body parsing
5. **Authentication** - JWT token validation
6. **Authorization** - Role-based access control
7. **Validation** - Request/response validation
8. **Error Handling** - Centralized error management

## 🛡️ Security Features

### **Authentication & Authorization**

- **JWT-based authentication** with secure token generation
- **Role-based access control** (Administrator, Teacher)
- **Password hashing** using bcrypt with salt rounds
- **Middleware-protected routes** with proper authorization

### **Data Validation**

- **Runtime validation** using Zod schemas
- **Input sanitization** for all API endpoints
- **Type-safe requests** with TypeScript interfaces

### **Security Headers**

- **Helmet.js** for security headers
- **CORS** configuration for controlled access
- **Rate limiting** capabilities (configurable)

## 💾 Database Schema

### **Core Entities**

- **Users** - Authentication and profile data
- **Teachers** - Academic staff with specialization
- **Students** - Learner profiles and enrollment
- **Courses** - Academic subjects and curriculum
- **Sections** - Class groupings and student organization
- **Classrooms** - Physical/virtual learning spaces
- **Schedules** - Time table entries and assignments
- **Specialities** - Academic programs and degrees
- **Seasons** - Academic year management

### **Database Features**

- **Relationship mapping** with Prisma ORM
- **Migration system** for schema evolution
- **Seeding** for development and testing
- **Connection pooling** for performance
- **Transaction support** for data integrity

## 🚀 Getting Started

### **Prerequisites**

- Node.js ≥ 18.0.0
- PostgreSQL database
- Redis server (optional, for caching)

### **Installation**

```bash
# Clone the repository
git clone [repository-url]
cd time-table-management

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Configure database
npm run prisma:migrate
npm run prisma:generate

# Seed development data (optional)
npm run prisma:seed
```

### **Environment Variables**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/timetable"

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"

# Server
PORT=3000
NODE_ENV="development"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### **Available Scripts**

```bash
# Development
npm run dev:ts        # Start with TypeScript compilation
npm run dev          # Build and start

# Production
npm run build        # Compile TypeScript
npm start           # Start production server

# Database
npm run prisma:migrate    # Run database migrations
npm run prisma:generate   # Generate Prisma client
npm run prisma:studio     # Open Prisma Studio
npm run prisma:seed       # Seed database

# Code Quality
npm run lint:check   # Check code style
npm run lint:fix     # Fix code style issues
npm run format       # Format code with Prettier
npm test            # Run tests
```

## 📚 API Documentation

### **Authentication Endpoints**

```
POST   /api/v1/auth/login           # User login
GET    /api/v1/auth/me             # Get current user profile
```

### **User Management**

```
GET    /api/v1/user                # List all users
POST   /api/v1/user                # Create new user
GET    /api/v1/user/:id            # Get user by ID
PUT    /api/v1/user/:id            # Update user
DELETE /api/v1/user/:id            # Delete user
POST   /api/v1/user/:id/change-password  # Change password
```

### **Teacher Management**

```
POST   /api/v1/teacher             # Create teacher
GET    /api/v1/teacher/me/schedule/:semester  # Get my schedule
```

### **Course Management**

```
GET    /api/v1/course              # List all courses
POST   /api/v1/course              # Create new course
GET    /api/v1/course/:id          # Get course by ID
PUT    /api/v1/course/:id          # Update course
DELETE /api/v1/course/:id          # Delete course
```

### **Schedule Management**

```
GET    /api/v1/section/:id/schedule/:semester           # Get section schedule
GET    /api/v1/section/:id/schedule/:semester/statistics # Get schedule statistics
GET    /api/v1/section/:id/schedule/:semester/generate-pdf # Generate PDF
```

## 🧪 Testing

### **Test Coverage**

- **Unit tests** for business logic
- **Integration tests** for API endpoints
- **Database tests** with test database
- **Authentication tests** for security

### **Running Tests**

```bash
npm test                    # Run all tests
npm test -- --watch        # Run tests in watch mode
npm test -- --coverage     # Generate coverage report
```

## 🔧 Development Workflow

### **Code Organization**

1. **Feature-first** - Group related functionality together
2. **Type safety** - Comprehensive TypeScript coverage
3. **Validation** - Zod schemas for runtime validation
4. **Error handling** - Centralized error management
5. **Logging** - Comprehensive application logging

### **Best Practices**

- **Consistent naming** conventions across modules
- **Standardized responses** with typed interfaces
- **Middleware composition** for reusable functionality
- **Service layer abstraction** for business logic
- **Repository pattern** for data access

## 📊 Performance Features

### **Caching Strategy**

- **Redis caching** for frequently accessed data
- **Database query optimization** with Prisma
- **Response caching** for static data

### **Scalability**

- **Modular architecture** for horizontal scaling
- **Stateless authentication** with JWT
- **Database connection pooling**
- **Async/await** for non-blocking operations

## 🔍 Monitoring & Logging

### **Logging System**

- **Morgan** for HTTP request logging
- **Custom logger** for application events
- **Error tracking** with detailed stack traces
- **Performance monitoring** capabilities

### **Error Handling**

- **Centralized error middleware**
- **Graceful error responses**
- **Development vs production** error details
- **Unhandled rejection** protection

## 🚀 Deployment

### **Production Considerations**

- **Environment-specific** configurations
- **Health check** endpoints
- **Graceful shutdown** handling
- **Process management** (PM2 recommended)
- **Database migration** automation

### **Docker Support**

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Follow** coding standards
4. **Add** tests for new features
5. **Submit** a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

Developed by **y.abderrahmne** and the development team.

---

**Built with ❤️ using modern JavaScript/TypeScript technologies**
