# 🚀 GoalBoost

> **Your Daily Productivity Companion — Set goals, track progress, and achieve more.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-goalboost.lovable.app-brightgreen?style=for-the-badge)](https://goalboost.lovable.app/)
[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-blueviolet?style=for-the-badge)](https://lovable.dev)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://react.dev)

---

## 📖 About

**GoalBoost** is a modern, full-stack productivity web app designed to help individuals set meaningful goals, stay consistent, and visualize their growth over time. With a clean interface, AI-powered suggestions, and real-time data sync, GoalBoost makes it easy to go from intention to achievement.

---

## ✨ Features

### 🎯 Goal Setting & Tracking
- Create short-term and long-term goals with ease
- Break goals down into actionable milestones
- Set deadlines and priorities to stay focused
- Mark goals as complete and celebrate progress

### 📊 Progress Visualization
- Intuitive dashboards with charts and progress bars
- Visual streaks and completion metrics
- Historical view of your journey over days, weeks, and months

### 🤖 AI-Powered Suggestions
- Smart recommendations to refine and improve your goals
- Personalized nudges to keep you on track
- AI assistance in setting realistic and SMART goals

### 🔐 User Authentication
- Secure sign-up and login powered by **Supabase Auth**
- Persistent user data across sessions and devices
- Protected routes ensuring data privacy

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| **Frontend** | React, TypeScript, Tailwind CSS      |
| **Backend**  | Supabase (PostgreSQL + Edge Functions)|
| **Auth**     | Supabase Auth                        |
| **Database** | Supabase (PostgreSQL)                |
| **Hosting**  | Lovable (Netlify-based deployment)   |
| **AI**       | Integrated AI suggestions            |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or above)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A [Supabase](https://supabase.com/) account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/lochanharishwar/goalboost.git
cd goalboost

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root of your project and add:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> You can find these in your **Supabase project dashboard → Settings → API**.

### Running the App

```bash
# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
goalboost/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # App pages/routes
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Supabase client & utilities
│   ├── types/            # TypeScript type definitions
│   └── main.tsx          # App entry point
├── supabase/
│   └── migrations/       # Database schema migrations
├── .env.example
├── package.json
└── README.md
```

---

## 🗄️ Database (Supabase)

GoalBoost uses **Supabase** as its backend, providing:

- **PostgreSQL** database for storing goals, milestones, and user data
- **Row-Level Security (RLS)** to ensure each user only accesses their own data
- **Real-time subscriptions** for live progress updates
- **Supabase Auth** for user sign-up, login, and session management

---

## 🌐 Deployment

GoalBoost is deployed via **Lovable** and accessible at:

🔗 **[https://goalboost.lovable.app/](https://goalboost.lovable.app/)**

To deploy your own version:
1. Fork this repository
2. Connect it to your Lovable or Netlify account
3. Add your Supabase environment variables in the deployment settings
4. Deploy!

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repo and clone your fork
git clone https://github.com/YOUR_USERNAME/goalboost.git

# 2. Create a new feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and commit
git commit -m "feat: add your feature description"

# 4. Push and open a Pull Request
git push origin feature/your-feature-name
```

Please follow the existing code style and write clear commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Lochan Harishwar**

- GitHub: [@lochanharishwar](https://github.com/lochanharishwar)

---

<p align="center">Made with ❤️ and ☕ — Built to help you achieve more, one goal at a time.</p>
