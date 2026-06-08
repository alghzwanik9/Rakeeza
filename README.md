# Rakeeza: AI-Powered Productivity

A modern bilingual (Arabic/English) web application for task management, event scheduling, and personal portfolio showcasing, enhanced with AI-driven insights and automation.

---

## 1. Project Overview

**Rakeeza** is designed to be the ultimate productivity hub for students and professionals. It combines traditional task management with a Pomodoro-style focus timer, streak gamification, and an intelligent AI Advisor to optimize workflows and generate public portfolios.

### Core Features

- **Dual Language Interface:** Seamless switching between Arabic (RTL) and English (LTR).
- **Focus Studio:** A globally synchronized Pomodoro-style timer that tracks deep work and auto-updates task durations.
- **Smart Task Management:** Categorization, deadline tracking, and drag-and-drop reordering.
- **AI Advisor:** Analyzes your active tasks to suggest workflows, automatically generates a professional bio, and creates a standalone HTML portfolio.
- **Gamification & Achievements:** Unlock badges for task completion, consistency (streaks), and accumulated points.
- **Dynamic Design System:** Modern, glassmorphism-inspired UI with dark and light modes and micro-animations.

---

## 2. Project Management & Architecture

This project is built with a modern frontend stack communicating with a real-time serverless backend.

### Technology Stack

- **Frontend Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS with daisyUI
- **Icons & Animations:** Lucide React, Framer Motion
- **Backend & Database:** Convex (Realtime Database, Mutations, & Queries)
- **Authentication:** Clerk React
- **AI Integration:** OpenAI API (via `@google/generative-ai`)
- **Language:** JavaScript (ES6+)

### Architecture Flow

1. **Authentication:** User logs in via Clerk. Clerk provides an identity token.
2. **Real-time Sync:** Convex verifies the Clerk token and immediately streams data (Tasks, Profiles, Events) to the frontend via WebSocket.
3. **Global State:** The application relies on Convex as the single source of truth. Features like the Focus Timer maintain their state in the `profiles.timer` database object, allowing users to switch devices (e.g., from Laptop to Phone) without losing their active session.
4. **AI Generation:** The `aiAdvisorHelper` communicates securely to generate text and HTML based on the user's current database state.

### Data Schema (Convex)

- **`users`**: Auth mappings.
- **`profiles`**: User details, bio, skills, points, streak, and the global `timer` state.
- **`tasks`**: Individual tasks with duration, completion status, and category.
- **`events`**: Calendar scheduling.

### Directory Structure

```text
rakeeza-app/
├── convex/               # Backend logic (Schema, Mutations, Queries)
├── src/
│   ├── components/       # Reusable UI components (Dashboard, Profile, etc.)
│   ├── hooks/            # Custom React hooks (e.g., useAppData for state bridging)
│   ├── lib/              # Helper utilities (AI logic)
│   ├── App.jsx           # Main application router and layout
│   └── i18n.js           # Internationalization setup
└── tailwind.config.js    # Design system tokens
```

---

## 3. Project Handover & Installation

Follow these instructions to set up the development environment, configure the backend, and deploy the application.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (or yarn/pnpm)
- [Convex Account](https://www.convex.dev/) (for backend deployment)
- [Clerk Account](https://clerk.com/) (for authentication)

### Environment Setup

Create a `.env` file in the `rakeeza-app/` root directory and add your API keys:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_CONVEX_URL=your_convex_url_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

*(Note: If using OpenAI instead of Gemini, update the key name accordingly in `aiAdvisorHelper.js`)*

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd rakeeza/rakeeza-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the Convex backend (Development):**

   ```bash
   npx convex dev
   ```

   *(This will prompt you to log in and create a project if you haven't already).*

4. **Start the Vite development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Builds the production bundle. |
| `npm run preview` | Previews the production build locally. |
| `npm run lint` | Runs ESLint to check code quality. |
| `npx convex dev` | Starts the Convex backend sync server. |

### Deployment Guide

1. **Backend Deployment:** Run `npx convex deploy` to push your schema and functions to the production Convex environment.
2. **Frontend Deployment:** Connect your GitHub repository to a hosting provider like **Vercel** or **Netlify**.
3. **Environment Variables:** Ensure that `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_CONVEX_URL` are added to your hosting provider's environment settings.
