import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

/**
 * useDashboardData Hook
 * Encapsulates the logic for fetching and managing dashboard state.
 */
export const useDashboardData = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dashboardService.getOverviewData();
                setTasks(data.tasks);
                setProjects(data.projects);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { tasks, projects, loading };
};
