import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './Components/Authentication/Login';
import Signup from './Components/Authentication/Signup';
import Dashboard from './Components/Output/Dashboard';
import LiveStatus from './Components/Live Platfrom Status/LiveStatus';
import KPI from './Components/Output/KPI';
import Audit from './Components/Output/Audit';

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
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;