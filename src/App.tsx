import React from 'react';
import './App.css';
import Navbar from './Navbar';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './Home';
import BulkReportUpload from './BulkReportUpload';
import ReportSubmissionForm from './ReportSubmissionForm';
import AdminDashboard from './AdminDashboard';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';

const AppContent: React.FC = () => {
  return (
    <div className='app-container'>
      <main className='main-content'>
        <Navbar />
        <div className='content-area'>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="login" element={<Login />} />
            <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
              <Route path="home" element={<Home />} />
              <Route path="upload" element={<BulkReportUpload />} />
              <Route path="submit" element={<ReportSubmissionForm />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </div>
      </main>

    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
