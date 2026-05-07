# KaryaAI Backend 🚀

The core engine of KaryaAI, providing a robust RESTful API for task management, secure authentication, and AI-powered execution strategies.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: Passport.js (Google & GitHub OAuth) & JWT
- **AI Engine**: Google Gemini AI (Generative AI SDK)
- **Security**: Helmet, Express Rate Limit, Mongo Sanitize, HPP

## ✨ Key Features

- **Multi-Provider OAuth**: Secure login via Google and GitHub.
- **Session Management**: Dual-token system (Access & Refresh) with HttpOnly cookies.
- **AI Strategist**: Leverages Gemini AI to generate detailed execution plans for tasks.
- **Advanced Task Management**: Full CRUD operations with priority, tags, and status tracking.
- **Production Ready**: Optimized CORS, security headers, and trust-proxy support for cloud deployment.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google AI Studio API Key (for Gemini)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
4. Fill in your environment variables.

### Running

- **Development**: `npm start` (Runs via Node)
- **Production**: Ensure `NODE_ENV=production` is set.

## 🔑 Environment Variables

| Variable | Description |
| :--- | :--- |
| `PORT` | Server port (default: 3000) |
| `MONGODB_URI` | Connection string for MongoDB |
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `JWT_ACCESS_SECRET` | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `GOOGLE_CLIENT_ID` | OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret |
| `GITHUB_CLIENT_ID` | OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | OAuth Client Secret |
| `FRONTEND_URL` | URL of your frontend (for CORS) |
| `BACKEND_URL` | URL of your backend (for OAuth callbacks) |

## 📡 API Routes

### Auth
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Local login
- `GET /api/v1/auth/google` - Initiate Google OAuth
- `GET /api/v1/auth/github` - Initiate GitHub OAuth
- `GET /api/v1/auth/me` - Get current user profile

### Tasks
- `GET /api/v1/tasks` - List all tasks
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/:id` - Get task details
- `PATCH /api/v1/tasks/:id` - Update task

### AI
- `POST /api/v1/ai/generate-strategy` - Generate AI strategy for a task
