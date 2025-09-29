import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './Components/Authentication/Login';
import Signup from './Components/Authentication/Signup';
import Dashboard from './Components/Output/Dashboard';
import LiveStatus from './Components/Live Platfrom Status/LiveStatus';
import KPI from './Components/Output/KPI';
import Audit from './Components/Output/Audit';
import Schedule from './Components/Schedule/Schedule';

// Create a placeholder component for User Settings
const UserSettings = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-white mb-4">User Settings</h1>
      <p className="text-slate-400">User settings page coming soon...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/status" element={<LiveStatus />} />
        <Route path="/kpi" element={<KPI />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/user-settings" element={<UserSettings />} />
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
