# KaryaAI Frontend 🎨

A premium, modern dashboard experience for managing tasks and interacting with AI assistants, built for speed and aesthetics.

## 🛠️ Tech Stack

- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS & Tailwind CSS (Custom Design System)
- **Animations**: Framer Motion
- **Icons**: Lucide React & React Icons
- **Data Fetching**: Axios (with custom interceptors)
- **Routing**: React Router 7

## ✨ Key Features

- **Stunning UI/UX**: Dark-themed, glassmorphic design with premium typography.
- **Dynamic Dashboard**: Real-time task overview, activity tracking, and priority management.
- **AI Integration**: Seamless interface for viewing AI-generated execution strategies.
- **Responsive Layout**: Optimized for desktop and mobile screens.
- **Smooth Transitions**: Micro-interactions and smooth page transitions using Framer Motion.

## 🚀 Getting Started

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```bash
   VITE_BACKEND_URL=http://localhost:3000
   ```

### Running

- **Development**: `npm run dev`
- **Production Build**: `npm run build`

## 📁 Project Structure

- `/src/features`: Modular feature-based structure (Auth, Tasks, Dashboard).
- `/src/components`: Shared UI components and layout wrappers.
- `/src/context`: Global state management (Auth and Task contexts).
- `/src/hooks`: Custom React hooks for API and UI logic.
- `/src/api`: Axios instance and interceptor configuration.

## 🔑 Environment Variables

- `VITE_BACKEND_URL`: The base URL of your backend API (e.g., `http://localhost:3000`).

## 🎨 Design System

KaryaAI uses a custom design system focused on:
- **HSL Colors**: Curated palettes for consistent dark mode.
- **Rich Micro-animations**: Enhancing user engagement.
- **Premium Components**: Custom-built inputs, buttons, and cards.
