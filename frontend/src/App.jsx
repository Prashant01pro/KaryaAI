import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <TaskProvider>
                    <Router>
                        <AppRoutes />
                    </Router>
                </TaskProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
