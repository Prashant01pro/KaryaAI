import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import HomePage from '../features/home/pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import SignupPage from '../features/auth/pages/SignupPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import TasksListPage from '../features/dashboard/pages/TasksListPage';

const AppRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/tasks" element={<TasksListPage type="all" />} />
                <Route path="/dashboard/high-priority" element={<TasksListPage type="high-priority" />} />
                <Route path="/dashboard/ai-assistant" element={<TasksListPage type="ai-assistant" />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;
