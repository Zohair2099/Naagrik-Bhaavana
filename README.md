# Naagarik Bhaavana: A Crowdsourced Civic Issue Reporting System

This is a full-stack web application built in Firebase Studio that empowers citizens to report civic issues and enables municipal authorities to track and manage them efficiently. The system leverages AI to automatically categorize and assess the severity of reported issues, streamlining the resolution process.

## How It Works

The workflow is simple and effective:
1.  A citizen signs up or logs in.
2.  They submit a new issue report, including a title, detailed description, location, and an optional photo.
3.  The backend receives the report, and a Genkit AI flow analyzes the content (text and image) to determine its category and severity.
4.  The new issue appears in real-time on the public dashboard for all to see and on the private admin dashboard.
5.  An administrator reviews the issue and updates its status (e.g., to "In Progress").
6.  The status change is reflected across the application, allowing the reporting citizen to track progress on their "My Reports" page.

## Key Features

### For Citizens
- **User Authentication:** Secure sign-up and login functionality.
- **Report an Issue (`/report`):** An intuitive form to submit new issue reports, complete with title, detailed description, location (with geolocation support), and photo uploads.
- **Public Dashboard (`/`):** A real-time, filterable dashboard displaying all reported issues on interactive cards.
- **Image Carousel:** A dynamic carousel on the dashboard showcasing recent civic improvements or news.
- **Upvote Issues:** Show support for an issue and help authorities prioritize by upvoting it.
- **My Reports (`/my-reports`):** A personalized page for users to track the status of all the issues they have submitted.

### For Administrators
- **Admin Dashboard (`/admin`):** A private dashboard that lists all reported issues in a sortable, easy-to-manage table.
- **Real-Time Status Updates:** Change the status of any issue (e.g., from "Reported" to "In Progress" or "Resolved") with a simple dropdown.

### AI-Powered Features
- **Automatic Categorization:** The AI analyzes the issue's description, location, and photo to automatically assign a relevant category (e.g., "Pothole", "Garbage", "Streetlight").
- **Severity Assessment:** The AI determines the severity of the issue (low, medium, or high) to help authorities with prioritization.

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **UI:** [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), and [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore, Cloud Storage)
- **Generative AI:** [Genkit (Google AI)](https://firebase.google.com/docs/genkit)

## Getting Started

This application is designed to run within Firebase Studio.

1.  **Run the development server:**
    ```bash
    npm run dev
    ```
2.  **Explore the app:**
    - **Home/Dashboard:** Navigate to the root URL (`/`) to see all public issues.
    - **Login/Signup:** Access the authentication forms at `/login` and `/signup`.
    - **Report an Issue:** Go to `/report` to submit a new issue (requires login).
    - **Your Reports:** View your personal submissions at `/my-reports` (requires login).
    - **Admin Panel:** Manage all issues at `/admin` (requires login).
