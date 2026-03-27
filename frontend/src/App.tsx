import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TutorList from './pages/TutorList';
import TutorDetail from './pages/TutorDetail';
import CreateBooking from './pages/CreateBooking';
import MyBookings from './pages/MyBookings';
import TutorPanel from './pages/TutorPanel';
import Navbar from './components/Navbar';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {isAuthenticated && <Navbar />}
            <div className="container">
                <Routes>
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/tutores" element={<PrivateRoute><TutorList /></PrivateRoute>} />
                    <Route path="/tutores/:id" element={<PrivateRoute><TutorDetail /></PrivateRoute>} />
                    <Route path="/reservar/:tutorId" element={<PrivateRoute><CreateBooking /></PrivateRoute>} />
                    <Route path="/mis-reservas" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
                    <Route path="/tutor-panel" element={<PrivateRoute><TutorPanel /></PrivateRoute>} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </div>
        </>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;