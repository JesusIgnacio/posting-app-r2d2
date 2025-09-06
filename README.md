# 🤖 Posting App R2D2

A modern Node.js application that fetches posts from the [Hacker News API](https://hn.algolia.com) and stores them locally in MongoDB. Built with ES6 modules, modern JavaScript patterns, and containerized with Docker.

## 🚀 Features

- **Modern JavaScript**: ES6 modules, async/await, arrow functions
- **RESTful API**: Clean endpoints for managing posts
- **MongoDB Integration**: Efficient data storage with connection pooling
- **Docker Support**: Containerized application for easy deployment
- **Health Checks**: Built-in health monitoring endpoint
- **Error Handling**: Comprehensive error handling and validation
- **Environment Configuration**: Flexible configuration via environment variables

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (ES6 Modules)
- **Framework**: [Express.js](https://expressjs.com) 4.18.2
- **Database**: [MongoDB](https://www.mongodb.com) 6.3.0
- **Containerization**: [Docker](https://www.docker.com/) & Docker Compose
- **Development**: [Nodemon](https://nodemon.io/) for hot reloading

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check endpoint |
| `GET` | `/api/` | API status and version info |
| `GET` | `/api/posts` | Fetch and store latest posts from Hacker News |
| `DELETE` | `/api/posts/:id` | Deactivate a specific post by ID |

## 🏃‍♂️ Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)

### Using Docker (Requires Dockerfile Update)

⚠️ **Important**: The current Dockerfile needs to be updated before using Docker. See "Docker Modernization" section below.

1. **Clone the repository**
   ```bash
   git clone https://github.com/JesusIgnacio/posting-app-r2d2.git
   cd posting-app-r2d2
   ```

2. **Update the Dockerfile** (see Docker Modernization section)

3. **Start the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - API: http://localhost:5000/api
   - Health Check: http://localhost:5000/health
   - Posts: http://localhost:5000/api/posts

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB** (if not using Docker)
   ```bash
   # Using Docker for MongoDB only
   docker run -d -p 27017:27017 --name mongo mongo:latest
   ```

4. **Run the application**
   ```bash
   # Development mode with hot reloading
   npm run dev
   
   # Production mode
   npm start
   ```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URL=mongodb://mongo:27017/
DB_NAME=test

# Environment
NODE_ENV=development
```

## 🐳 Docker Configuration

The application includes:
- **Dockerfile**: Currently uses Node.js 10 (needs updating to Node.js 18+)
- **docker-compose.yml**: Complete stack with MongoDB using Docker Compose v2
- **.dockerignore**: Optimized build context

⚠️ **Note**: The current Dockerfile needs modernization to work with the updated codebase. See the "Docker Modernization" section below.

## 🔧 Docker Modernization

The current Docker setup needs updates to work with the modernized codebase. Here are the required changes:

### Update Dockerfile

Replace the current Dockerfile content with:

```dockerfile
# Use Node.js 18 LTS
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["node", "src/index.js"]
```

### Update docker-compose.yml

Update to Docker Compose version 3:

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URL=mongodb://mongo:27017/
      - DB_NAME=test
      - NODE_ENV=production
    depends_on:
      - mongo
    restart: unless-stopped
  
  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
```

### Create .dockerignore

Create a `.dockerignore` file:

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.docker
```

## 📊 Data Model

Posts are stored with the following structure:
```javascript
{
  story_id: Number,
  story_author: String,
  story_title: String,
  story_url: String,
  created_at: String,
  story_state: Boolean
}
```

## 🔧 Development Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm test        # Run tests (placeholder)
```

## 🚦 Health Monitoring

The application includes a health check endpoint at `/health` that returns:
```json
{
  "status": "OK",
  "message": "Posts API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**JCastillo** - [GitHub Profile](https://github.com/JesusIgnacio)

---

*Built with ❤️ and modern JavaScript*
