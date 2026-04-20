import axiosInstance from '../../../api/axiosInstance';

export const taskService = {
    getTasks: async (params = {}) => {
        const response = await axiosInstance.get('/tasks', { params });
        return response.data;
    },

    getTaskById: async (taskId) => {
        const response = await axiosInstance.get(`/tasks/${taskId}`);
        return response.data;
    },

    createTask: async (taskData) => {
        const response = await axiosInstance.post('/tasks', taskData);
        return response.data;
    },

    updateTask: async (taskId, taskData) => {
        const response = await axiosInstance.patch(`/tasks/${taskId}`, taskData);
        return response.data;
    },

    deleteTask: async (taskId) => {
        const response = await axiosInstance.delete(`/tasks/${taskId}`);
        return response.data;
    }
};
