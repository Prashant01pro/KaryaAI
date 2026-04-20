import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

import { TaskProvider } from './context/TaskContext';

function App() {
    return (
        <AuthProvider>
            <TaskProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </TaskProvider>
        </AuthProvider>
    );
}

export default App;
