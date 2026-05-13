# Smart Attendance System with QR Code

A full-stack web application designed for colleges and universities to modernize their attendance tracking. Built with a React frontend (Vite) and Node.js/Express backend (SQLite).

## Features

*   **Role-based Dashboards:** Dedicated experiences for Teachers and Students.
*   **QR Code Generation:** Teachers can instantly generate secure, dynamic QR codes for their sessions.
*   **Quick Scan & Mark:** Students simply enter the 8-character session code (or scan a QR code if implemented via mobile) to mark their attendance instantly.
*   **Live Attendance Tracking:** Teachers can see who is attending in real-time.
*   **Analytics & History:** Visual bar charts for attendance overview and detailed history logs.
*   **CSV Export:** Download attendance reports with one click.
*   **Modern UI:** Glassmorphism design, fully responsive, and includes a dark mode default.

## Technology Stack

*   **Frontend:** React 19, Vite, Tailwind CSS 4, React Router, Axios, Chart.js, Lucide React (Icons).
*   **Backend:** Node.js, Express.js, SQLite3, JSON Web Tokens (JWT), bcrypt.

## Default Test Accounts

You can log in immediately using these seeded accounts:

**Teacher Account:**
*   Email: `teacher@test.com`
*   Password: `Teacher123`

**Student Account:**
*   Email: `student@test.com`
*   Password: `Student123`

## Installation & Setup

1.  **Clone or open the repository.**
2.  Open two terminal windows (one for the server, one for the client).

### Backend Setup (Terminal 1)

```bash
cd server
npm install
npm run dev
```
*Note: The SQLite database (`attendance.db`) will be automatically created and seeded with the test accounts when the server first runs.*

### Frontend Setup (Terminal 2)

```bash
cd client
npm install
npm start
```
*Note: `npm start` is mapped to `vite` which starts the dev server (typically on http://localhost:5173).*

## Project Structure

```
smart-attendance/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth Context for state management
│   │   ├── pages/          # Landing, Login, Signup, Dashboards
│   │   ├── App.jsx         # Main router and protected routes
│   │   └── index.css       # Tailwind entry and global styles
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── database/           # SQLite DB connection and schema
│   ├── middleware/         # JWT and Role verification
│   ├── routes/             # API routes (Auth, Teacher, Student)
│   ├── .env                # Environment variables
│   ├── server.js           # Express app entry point
│   └── package.json
│
└── README.md
```

## Deployment

*   **Frontend (Vercel):** The `client` folder is ready to be deployed to Vercel. Ensure the build command is `npm run build` and the output directory is `dist`. You will need to change the API base URL in the frontend code to point to your live backend.
*   **Backend (Render/Railway):** The `server` folder can be deployed as a web service. Ensure you set the `JWT_SECRET` environment variable in the host's dashboard.

## Troubleshooting

*   **Tailwind styles not applying?** Ensure `npm install` completed successfully in the `client` folder.
*   **Backend not connecting?** Ensure the backend is running on `http://localhost:5000` (check the console for "Server is running on port 5000"). If the port is in use, change the `PORT` in `server/.env` and update the Axios requests in the frontend pages.
