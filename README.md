# Crowdsourced Civic Issue Reporting System

This is a full-stack web application built in Firebase Studio that allows citizens to report civic issues, and for municipal authorities to track and manage them. The system leverages AI for automatic categorization and severity assessment of the reported issues.

## Key Features

### For Citizens
- **User Authentication:** Secure sign-up and login functionality.
- **Report an Issue:** Submit new issue reports including a title, detailed description, location, and an optional photo.
- **Public Dashboard (`/`):** View all reported issues on a filterable dashboard.
- **Upvote Issues:** Show support for an issue by upvoting it.
- **My Reports (`/my-reports`):** A personalized page to track the status of all issues reported by the user.

### For Administrators
- **Admin Dashboard (`/admin`):** A private dashboard that lists all reported issues in a table.
- **Status Updates:** Change the status of an issue (e.g., from "Reported" to "In Progress" or "Resolved") in real-time.

### AI-Powered Features
- **Automatic Categorization:** The AI analyzes the issue's description, location, and photo to automatically assign a category (e.g., "Pothole", "Garbage").
- **Severity Assessment:** The AI determines the severity of the issue (low, medium, or high) to help with prioritization.

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **UI:** [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), and [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Firebase](https://firebase.google.com/) (Authentication, Firestore, Cloud Storage)
- **Generative AI:** [Genkit (Google AI)](https://firebase.google.com/docs/genkit)

## Getting Started

This application is designed to run within Firebase Studio.

1.  **Run the development server:**
    ```bash
    npm run dev
    ```
2.  **Explore the app:**
    - **Home/Dashboard:** Navigate to the root URL (`/`) to see all public issues.
    - **Report an Issue:** Go to `/report` to submit a new issue (requires login).
    - **Login/Signup:** Access the authentication forms at `/login` and `/signup`.
    - **Admin Panel:** Manage issues at `/admin` (requires login).
    - **Your Reports:** View your personal submissions at `/my-reports` (requires login).
