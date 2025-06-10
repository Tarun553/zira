# Zira - The Modern Project Management Tool

![Zira Banner](public/logo.png)

**Zira** is a powerful, intuitive, and feature-rich project management tool designed to help teams streamline their workflows, track progress, and collaborate seamlessly. Inspired by Jira, Zira is built with a modern, robust, and scalable tech stack, making it the perfect solution for agile teams of all sizes.

---

## ✨ Key Features

-   **Intuitive Task Management**: Organize your work with customizable boards, statuses, and priorities. Drag-and-drop functionality makes it easy to manage tasks.
-   **Agile Boards**: Visualize your workflow with Kanban and Scrum boards. Track sprints, manage backlogs, and keep your team aligned.
-   **Real-time Collaboration**: Stay in sync with instant updates, comments, and notifications. @mention teammates to get their attention.
-   **Secure Authentication**: User management is handled by **Clerk**, providing secure sign-up, sign-in, and profile management.
-   **Powerful Reporting & Analytics**: Gain insights into your team's performance with burndown charts, velocity tracking, and customizable dashboards.
-   **Customizable Workflows**: Adapt Zira to your team's unique processes with custom fields, issue types, and workflow automation.
-   **Theme Toggling**: Switch between light and dark modes for a comfortable viewing experience, powered by `next-themes`.
-   **Extensible & Developer-Friendly**: Built with modern tools and best practices, making it easy to extend and customize.

---

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Authentication**: [Clerk](https://clerk.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A running [PostgreSQL](https://www.postgresql.org/download/) instance

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Tarun553/zira.git
    cd zira
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env.local` file in the root of your project and add the following variables. You can use the `.env.example` file as a template.
    ```env
    # PostgreSQL connection string
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    ```

4.  **Run database migrations:**
    This will sync your database schema with the Prisma schema.
    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

-   [shadcn/ui](https://ui.shadcn.com/) for the fantastic UI components.
-   [Clerk](https://clerk.com/) for simplifying authentication.
-   [Vercel](https://vercel.com/) for the seamless deployment experience.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
