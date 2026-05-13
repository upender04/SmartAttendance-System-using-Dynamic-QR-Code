import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Users, ShieldCheck, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-8 py-6 flex justify-between items-center glass-card rounded-none border-t-0 border-l-0 border-r-0 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-brand-600 p-2 rounded-lg">
            <QrCode className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-slate-800 dark:text-white">SmartAttendance</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors">
            Login
          </Link>
          <Link to="/signup" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Modernize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-500">Attendance</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A fast, secure, and intuitive QR-code based attendance system for modern colleges and universities.
          </p>
          <div className="flex justify-center gap-6 pt-4">
            <Link to="/signup" className="btn-primary text-lg px-8 py-4">
              Start for Free
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-lg font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
              Teacher / Student Login
            </Link>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full mt-24">
          <div className="glass-card p-8 flex flex-col items-center text-center">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-6">
              <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Lightning Fast</h3>
            <p className="text-slate-600 dark:text-slate-400">Mark attendance in seconds with real-time QR code generation and scanning.</p>
          </div>
          
          <div className="glass-card p-8 flex flex-col items-center text-center">
            <div className="bg-brand-100 dark:bg-brand-900/50 p-4 rounded-full mb-6">
              <ShieldCheck className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Secure & Fraud-Proof</h3>
            <p className="text-slate-600 dark:text-slate-400">Dynamic session codes prevent proxy attendance and ensure data integrity.</p>
          </div>

          <div className="glass-card p-8 flex flex-col items-center text-center">
            <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full mb-6">
              <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Role-based Access</h3>
            <p className="text-slate-600 dark:text-slate-400">Dedicated dashboards for teachers to manage sessions and students to track progress.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
        <p>© {new Date().getFullYear()} Smart Attendance System. A final year project.</p>
      </footer>
    </div>
  );
};

export default Landing;
