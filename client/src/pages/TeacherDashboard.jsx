import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import { LogOut, Plus, StopCircle, Clock, Users, Calendar } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TeacherDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeSessions, setActiveSessions] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActiveSessions();
    fetchHistory();
  }, []);

  const fetchActiveSessions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/session/active');
      setActiveSessions(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch active sessions');
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance/all');
      setAttendanceHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/session/create', { subject });
      toast.success('Session created successfully!');
      setSubject('');
      fetchActiveSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      await axios.post('http://localhost:5000/api/session/end', { sessionId });
      toast.info('Session ended.');
      fetchActiveSessions();
      fetchHistory(); // Refresh history
    } catch (err) {
      toast.error('Failed to end session');
    }
  };

  const handleDownloadCSV = () => {
    if (attendanceHistory.length === 0) {
      toast.warn("No data to download");
      return;
    }

    const headers = ["Session ID,Subject,Date,Student Name,Student Email,Time"];
    const rows = attendanceHistory.map(row => 
      `${row.session_id},"${row.subject}",${new Date(row.session_date).toLocaleDateString()},"${row.student_name || 'N/A'}","${row.student_email || 'N/A'}",${row.attendance_time ? new Date(row.attendance_time).toLocaleTimeString() : 'N/A'}`
    );

    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group history for chart (e.g. attendance count per subject)
  const getChartData = () => {
    const subjectCounts = {};
    attendanceHistory.forEach(record => {
      if (record.student_name) { // only count if a student actually attended
        subjectCounts[record.subject] = (subjectCounts[record.subject] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(subjectCounts),
      datasets: [
        {
          label: 'Total Attendances',
          data: Object.values(subjectCounts),
          backgroundColor: 'rgba(139, 92, 246, 0.5)', // brand-500
          borderColor: 'rgb(139, 92, 246)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
      {/* Navbar */}
      <nav className="glass-card rounded-none border-t-0 border-x-0 px-8 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xl">
            {user?.name?.charAt(0) || 'T'}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Teacher Dashboard</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Session Card */}
          <div className="glass-card p-6 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-500" /> New Session
            </h2>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject / Class Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Computer Networks CS-301"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center gap-2">
                {loading ? 'Creating...' : <><Plus className="w-4 h-4"/> Create & Generate QR</>}
              </button>
            </form>
          </div>

          {/* Active Sessions */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-500" /> Active Sessions
            </h2>
            
            {activeSessions.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-500 dark:text-slate-400">
                No active sessions. Create one to generate a QR code.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {activeSessions.map((session) => (
                  <div key={session.id} className="glass-card p-6 border-l-4 border-l-brand-500 flex flex-col items-center">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">{session.subject}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Code: {session.session_code}</p>
                    
                    <div className="bg-white p-4 rounded-xl shadow-inner mb-6">
                      <QRCodeSVG value={session.session_code} size={180} />
                    </div>
                    
                    <button 
                      onClick={() => handleEndSession(session.id)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 transition-colors font-medium"
                    >
                      <StopCircle className="w-4 h-4" /> End Session
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analytics & History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-500" /> Attendance Overview
            </h2>
            <div className="w-full h-64">
              {Object.keys(getChartData().labels).length > 0 ? (
                <Bar 
                  data={getChartData()} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }} 
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
              )}
            </div>
          </div>

          <div className="glass-card p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-500" /> Recent History
              </h2>
              <button onClick={handleDownloadCSV} className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
                Download CSV
              </button>
            </div>
            
            <div className="flex-grow overflow-auto max-h-64 pr-2">
              {attendanceHistory.length === 0 ? (
                <div className="text-center text-slate-400 py-8">No history found</div>
              ) : (
                <div className="space-y-3">
                  {attendanceHistory.slice(0, 50).map((record, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex justify-between items-center border border-slate-100 dark:border-slate-700/50">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{record.student_name || 'No attendees'}</p>
                        <p className="text-xs text-slate-500">{record.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(record.session_date).toLocaleDateString()}
                        </p>
                        {record.attendance_time && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {new Date(record.attendance_time).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;
