  <h1>Ridho Robbi Pasi | Portfolio</h1>
  <p>🔥 A professional portfolio built to showcase scalable web applications, modern UI/UX design, and robust backend engineering. Crafted with Next.js, TypeScript, Tailwind CSS, SWR, and Supabase.</p> 

[![GitHub Repo stars](https://img.shields.io/github/stars/ridhopasii/ridho-porto)](https://github.com/ridhopasii/ridho-porto/stargazers)
[![Last Update](https://img.shields.io/badge/deps%20update-every%20sunday-blue.svg)](https://shields.io/)

<br/>

## 📘 Introduction

Welcome to my digital space. I am **Ridho Robbi Pasi**, a developer specializing in bridging the gap between engaging UI/UX design and scalable backend architecture. 

This repository houses my personal website and portfolio, serving as a live demonstration of my capabilities in creating production-ready applications that solve real-world problems.

Feel free to explore the source code. If you find this architecture and code structure useful, consider giving it a star ⭐.

---

## 🛠️ Tech Stack & Architecture

This application is built with modern web technologies focused on performance, maintainability, and user experience:

- **⚛️ Frontend:** Next.js, React, TypeScript
- **💠 Styling & Animation:** Tailwind CSS v3, Framer Motion
- **🦫 State & Data Management:** Zustand, SWR
- **🌐 Localization:** Next-Intl (i18n)
- **🗄️ Database & Auth:** Supabase (PostgreSQL), NextAuth, Firebase (Chat)
- **📏 Quality Control:** ESLint, Prettier, Husky, Conventional Commits

---

## 🚀 Key Features

### 📊 Developer Dashboard
An interactive dashboard built with Next.js API routes that aggregates and visualizes my continuous development journey:
- **GitHub Contributions:** Real-time activity tracking.
- **Wakatime Data:** Weekly coding statistics and languages used.
- **Codewars & Monkeytype:** Logic and typing performance metrics.

### 🗳 Dynamic Project Showcase
Projects are stored in a Supabase PostgreSQL database and rendered using ISR (Incremental Static Regeneration) to ensure instant loading speeds while keeping content fresh.

### 🌍 Seamless Internationalization
Full i18n support (English & Indonesian) leveraging `next-intl` to reach both local and global audiences seamlessly.

---

## 💻 Getting Started

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/ridhopasii/ridhorobbipasi.my.id
cd ridhorobbipasi.my.id
```

### 2. Install Dependencies

```bash
# Recommended to use Bun for package management
bun install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```
Populate `.env` with your own credentials (Supabase, GitHub, Wakatime, etc.).

### 4. Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📄 License

This project is open-sourced under the MIT License.
