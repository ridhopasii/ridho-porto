# Architecture Documentation

## Overview

This portfolio website follows a layered architecture pattern with clear separation of concerns.

## Architecture Layers

### 1. Presentation Layer
- **EJS Templates**: Server-side rendering
- **Static Assets**: CSS, JavaScript, Images
- **Client-side JavaScript**: Interactive features

### 2. Middleware Layer
- **Security**: Helmet, Rate Limiting, CSRF
- **Logging**: Request logging with Morgan
- **Validation**: Input validation with express-validator
- **Error Handling**: Centralized error handler
- **Compression**: Response compression
- **File Upload**: Secure file upload with Multer

### 3. Application Layer
- **Routes**: Route definitions
- **Controllers**: Request handling
- **Services**: Business logic
- **Utilities**: Helper functions

### 4. Data Layer
- **Prisma ORM**: Database access
- **Cache**: Memory caching with node-cache
- **File System**: Image storage

## Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Browser - HTML/CSS/JS + EJS Templates)                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Middleware Stack                          │
│  • Helmet (Security Headers)                                 │
│  • Rate Limiter                                              │
│  • CSRF Protection                                           │
│  • Compression (Gzip/Brotli)                                 │
│  • Request Logger                                            │
│  • Input Validator                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Routes  │→ │Controllers │→ │ Services │→ │Repository│ │
│  └──────────┘  └────────────┘  └──────────┘  └──────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Centralized Error Handler                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  • Prisma ORM                                                │
│  • Memory Cache                                              │
│  • Image Optimization (Sharp)                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      SQLite Database                         │
└─────────────────────────────────────────────────────────────┘
```

## Design Patterns

### 1. Service Layer Pattern
- Business logic separated from controllers
- Reusable service methods
- Base service class for common operations

### 2. Repository Pattern
- Data access abstraction
- Prisma as the repository implementation

### 3. Middleware Pattern
- Request/response processing pipeline
- Modular and reusable middleware

### 4. Error Handling Pattern
- Custom error classes
- Centralized error handler
- Consistent error responses

### 5. Caching Pattern
- Cache-aside pattern
- TTL-based expiration
- Cache invalidation on updates

## Data Flow

### Request Flow
1. Client sends HTTP request
2. Request passes through middleware stack
3. Route handler invokes controller
4. Controller calls service method
5. Service performs business logic
6. Service calls repository (Prisma)
7. Repository queries database
8. Response flows back through layers
9. Client receives response

### Error Flow
1. Error occurs in any layer
2. Error is caught and passed to error handler
3. Error handler logs the error
4. Error handler formats error response
5. Client receives error response

## Security Architecture

### Defense in Depth
1. **Network Layer**: Rate limiting
2. **Application Layer**: Input validation, CSRF protection
3. **Data Layer**: Parameterized queries (Prisma)
4. **Transport Layer**: HTTPS (production)

### Security Headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

## Performance Optimization

### Caching Strategy
- **Memory Cache**: Frequently accessed data
- **Browser Cache**: Static assets
- **Service Worker**: Offline support

### Image Optimization
- Resize on upload
- Format conversion (WebP)
- Lazy loading
- Responsive images

### Response Optimization
- Gzip/Brotli compression
- Minification (production)
- CDN (future)

## Scalability Considerations

### Current Limitations
- SQLite (single file database)
- In-memory cache (single instance)
- File-based uploads

### Future Improvements
- PostgreSQL/MySQL for production
- Redis for distributed caching
- S3/Cloud storage for uploads
- Load balancing
- Horizontal scaling

## Monitoring & Observability

### Logging
- Winston for structured logging
- Log levels: error, warn, info, http, debug
- Log rotation
- Separate error logs

### Health Checks
- `/health`: Basic health check
- `/ready`: Readiness check with dependencies
- `/live`: Liveness probe

### Metrics (Future)
- Request rate
- Response time
- Error rate
- Cache hit rate

## Testing Strategy

### Unit Tests
- Services
- Utilities
- Middleware

### Integration Tests
- API endpoints
- Database operations
- File uploads

### Coverage Target
- 80%+ code coverage
- Critical paths: 100%

## Deployment Architecture

### Development
- Local SQLite database
- Hot reload
- Debug logging

### Production
- Docker container
- Environment-based configuration
- Production logging
- Health checks

## Technology Stack

### Backend
- Node.js 18+
- Express.js 5
- Prisma ORM
- SQLite

### Frontend
- EJS templates
- Tailwind CSS
- Vanilla JavaScript
- Socket.IO

### DevOps
- Docker
- GitHub Actions
- Jest
- ESLint/Prettier

## Best Practices

### Code Organization
- Feature-based structure
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)

### Error Handling
- Always use try-catch for async operations
- Custom error classes
- Meaningful error messages
- Proper HTTP status codes

### Security
- Never trust user input
- Validate and sanitize all inputs
- Use parameterized queries
- Keep dependencies updated

### Performance
- Cache frequently accessed data
- Optimize database queries
- Compress responses
- Lazy load resources

## Maintenance

### Regular Tasks
- Update dependencies
- Review logs
- Monitor performance
- Backup database
- Security audits

### Code Quality
- Run linter before commit
- Write tests for new features
- Review code before merge
- Document complex logic
