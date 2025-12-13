# 🌐 Portfolio

> A modern, responsive, and interactive portfolio website built with the latest web technologies.

![Website Preview](./public/story/img-1.jpg)

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## 📖 About

This project is a personal portfolio website designed to showcase my journey, projects, and technical writings. It is built with a focus on performance, accessibility, and a premium user experience. The site features a custom-built content management system for articles, an interactive timeline of my career milestones, and a showcase of my work.

## ✨ Features

-   **🎨 Modern & Responsive Design**: Built with **Tailwind CSS** and **Shadcn UI** for a sleek, dark-mode-first aesthetic that adapts to all screen sizes.
-   **📽️ Project Showcase**: specific section to display projects with details, technologies used, and links.
-   **📝 Custom Blog Engine**: A full-featured blog system with **MDXEditor** for rich text editing, supporting Markdown and HTML.
-   **📅 Interactive Timeline**: A visually engaging timeline component powered by **Framer Motion** to narrate professional milestones.
-   **🔐 Secure Admin Dashboard**: Protected routes and API endpoints using custom JWT authentication for managing content.
-   **📨 Contact & Requests**: "Work With Me" form integrated with backend processing for handling client inquiries.
-   **⚡ High Performance**: Server-Side Rendering (SSR) and Static Site Generation (SSG) with Next.js 15 App Router.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Tailwindcss Animate](https://github.com/jamiebuilds/tailwindcss-animate)
-   **Components**: [Shadcn UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/), [Lottie React](https://lottiefiles.com/)
-   **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
-   **Forms**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
-   **Editor**: [MDXEditor](https://mdxeditor.dev/)

### Backend
-   **Runtime**: Next.js API Routes (Serverless)
-   **Database**: [MongoDB](https://www.mongodb.com/) (with [Mongoose](https://mongoosejs.com/))
-   **Storage**: [Firebase Storage](https://firebase.google.com/docs/storage)
-   **Authentication**: Custom verified JWT (JSON Web Tokens)
-   **Email**: [Nodemailer](https://nodemailer.com/)

### DevOps & Tools
-   **Linting**: ESLint
-   **Testing**: Jest, React Testing Library
-   **Deployment**: Vercel

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   **Node.js** (v20 or higher recommended)
-   **npm** or **yarn**
-   **MongoDB** connection string
-   **Firebase** project credentials

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/seniru-dilmith/portfolio.git
    cd portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Copy the `.env.example` file to `.env` and fill in the required values.
    
    ```bash
    cp .env.example .env
    ```
    
    **Required Variables:**
    
    | Variable | Description |
    | :--- | :--- |
    | `NEXT_JWT_SECRET` | Secret key for JWT signing |
    | `NEXT_JWT_ACCESS_SECRET` | Secret for access tokens |
    | `NEXT_JWT_REFRESH_SECRET` | Secret for refresh tokens |
    | ... | *See `.env.example` for full list* |

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Scripts

-   `npm run dev`: Starts the development server using Turbopack.
-   `npm run build`: Builds the application for production.
-   `npm start`: Starts the production server.
-   `npm run lint`: Runs ESLint to check for code quality issues.
-   `npm test`: Runs Jest test suite.

## 🤝 Contributing

Contributions are always welcome!

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📬 Contact

-   **Website**: [seniru.dev](https://seniru.dev)
-   **Email**: [dilmithseniru@gmail.com](mailto:dilmithseniru@gmail.com)
-   **LinkedIn**: [Seniru Dilmith](https://linkedin.com/in/seniru-dilmith)
-   **Twitter**: [@SeniruDilmith](https://twitter.com/SeniruDilmith)

---

&copy; 2025 Seniru Dilmith. All rights reserved.
