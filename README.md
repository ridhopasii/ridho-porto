# Portfolio Website

Modern portfolio website built with Express.js, Prisma, and EJS.

## 🚀 Features

- ✅ Secure authentication with rate limiting
- ✅ Image optimization and lazy loading
- ✅ SEO optimized with meta tags and structured data
- ✅ PWA support with service worker
- ✅ Comprehensive error handling and logging
- ✅ Caching for improved performance
- ✅ Responsive design
- ✅ Admin dashboard for content management
- ✅ Real-time updates with Socket.IO
- ✅ Docker support
- ✅ CI/CD with GitHub Actions

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** SQLite with Prisma ORM
- **Template Engine:** EJS
- **Styling:** Tailwind CSS
- **Testing:** Jest, Supertest
- **Code Quality:** ESLint, Prettier, Husky
- **Security:** Helmet, Rate Limiting, Input Validation
- **Performance:** Compression, Caching, Image Optimization

## 📋 Prerequisites

- Node.js >= 18.x
- npm >= 9.x

## 🔧 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd hafidzhumaidi-clone
```

2. Install dependencies
```bash
npm install
```

3. Copy environment file
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`

5. Run database migrations
```bash
npx prisma migrate dev
```

6. Seed the database
```bash
npm run seed
```

7. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📜 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🐳 Docker

### Build and run with Docker

```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

### Using Docker Compose

```bash
# Production
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml up
```

## 📁 Project Structure

```
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   └── utils/           # Utility functions
├── tests/
│   ├── unit/            # Unit tests
│   └── integration/     # Integration tests
├── public/              # Static files
├── views/               # EJS templates
├── prisma/              # Database schema and migrations
└── docs/                # Documentation

```

## 🔒 Security Features

- Rate limiting on sensitive endpoints
- CSRF protection
- Security headers (Helmet)
- Input validation and sanitization
- Secure file upload
- XSS protection
- SQL injection protection (Prisma)

## 🎨 Code Quality

- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks
- Jest for testing
- 80%+ test coverage

## 📊 Performance

- Response compression (Gzip/Brotli)
- Image optimization with Sharp
- Memory caching
- Lazy loading
- Service worker for offline support

## 🌐 SEO

- Dynamic meta tags
- Open Graph tags
- Twitter Card tags
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt

## 📝 Environment Variables

See `.env.example` for all available environment variables.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT

## 👤 Author

Hafidz Humaidi Pratama Busroni

- GitHub: [@hfdzhummaidiii](https://github.com/hfdzhummaidiii)
- LinkedIn: [Hafidz Humaidi](https://www.linkedin.com/in/hafidz-humaidi-pratama-busroni-986a75357)
- Instagram: [@hfdzhummaidiii_](https://instagram.com/hfdzhummaidiii_)

## 🙏 Acknowledgments

- Express.js team
- Prisma team
- All contributors
