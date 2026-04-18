/**
 * Dashboard Service
 * Fetches tasks and projects data.
 */

export const dashboardService = {
    getOverviewData: async () => {
        // Simulating API fetch
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    tasks: [
                        { id: 1, title: 'Design System Audit & Update', priority: 'High', due: 'Oct 24', team: 'Design Team' },
                        { id: 2, title: 'Review Q3 Financial Reports', priority: 'Medium', due: 'Oct 26', team: 'Management' },
                        { id: 3, title: 'Internal API Documentation', priority: 'Low', due: 'Nov 2', team: 'Engineering' }
                    ],
                    projects: [
                        { name: 'Redesign 2.0', progress: 75, tasksLeft: 12, color: 'primary' },
                        { name: 'Mobile App MVP', progress: 32, tasksLeft: 44, color: 'secondary' }
                    ]
                });
            }, 800);
        });
    }
};
