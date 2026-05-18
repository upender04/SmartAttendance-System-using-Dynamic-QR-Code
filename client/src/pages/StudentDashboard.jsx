import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LogOut, ScanLine, Clock, Award } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [sessionCode, setSessionCode] = useState('');
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalAttended: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('https://smartattendance-system-using-dynamic-qr.onrender.com/api/attendance/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch history');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('https://smartattendance-system-using-dynamic-qr.onrender.com/api/attendance/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('https://smartattendance-system-using-dynamic-qr.onrender.com/api/attendance/mark', { sessionCode });
      toast.success('Attendance marked successfully!');
      setSessionCode('');
      fetchHistory();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
      {/* Navbar */}
      <nav className="glass-card rounded-none border-t-0 border-x-0 px-8 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xl">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Student Dashboard</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-l-brand-500">
            <div className="bg-brand-100 dark:bg-brand-900/50 p-4 rounded-full">
              <Award className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Total Classes Attended</p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stats.totalAttended}</h3>
            </div>
          </div>
          
          <div className="glass-card p-6 border-t-4 border-t-brand-500 flex flex-col justify-center">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-brand-500" /> Mark Attendance
            </h2>
            <form onSubmit={handleMarkAttendance} className="flex gap-3">
              <input
                type="text"
                required
                className="input-field flex-grow font-mono text-center tracking-widest uppercase"
                placeholder="Enter 8-char Code"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                maxLength={8}
              />
              <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
                {loading ? 'Submitting...' : 'Mark'}
              </button>
            </form>
          </div>
        </div>

        {/* History */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-500" /> My Attendance History
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4 font-medium">Subject</th>
                  <th className="py-3 px-4 font-medium">Teacher</th>
                  <th className="py-3 px-4 font-medium text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-slate-500 dark:text-slate-400">
                      No attendance records found. Mark attendance using a session code!
                    </td>
                  </tr>
                ) : (
                  history.map((record, idx) => (
                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-slate-800 dark:text-slate-200">{record.subject}</td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{record.teacher_name}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="block text-slate-800 dark:text-slate-200">{new Date(record.session_date).toLocaleDateString()}</span>
                        <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full mt-1 inline-block">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
