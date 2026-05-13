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

*   **Frontend (Vercel / Netlify / any static host):** The `client` folder is ready for deployment.
    * Build command: `npm run build`
    * Output directory: `dist`
    * Set `VITE_API_BASE_URL` in your deployment environment to the backend URL, for example `https://your-backend.example.com`.
    * In development, it falls back to `http://localhost:5000`.
*   **Backend (Render / Railway / Heroku / any Node host):** Deploy the `server` folder as a Node service.
    * Install dependencies with `npm install`.
    * Start with `npm start`.
    * Required environment variables:
      * `JWT_SECRET` — secret used to sign user tokens
      * `PORT` — optional, defaults to `5000`

### Example deploy flow

1. Deploy the backend first and note the live URL.
2. Deploy the frontend and set `VITE_API_BASE_URL` to that URL.
3. Open the frontend and verify login/signup works against the live API.

## Troubleshooting

*   **Tailwind styles not applying?** Ensure `npm install` completed successfully in the `client` folder.
*   **Backend not connecting?** Ensure the backend is running on `http://localhost:5000` (check the console for "Server is running on port 5000"). If the port is in use, change the `PORT` in `server/.env` and update the Axios requests in the frontend pages.
