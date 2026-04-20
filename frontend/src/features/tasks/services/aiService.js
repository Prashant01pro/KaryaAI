import axiosInstance from '../../../api/axiosInstance';

export const aiService = {
    generateTaskStrategy: async (taskId) => {
        const response = await axiosInstance.post(`/ai/generate-strategy/${taskId}`);
        return response.data;
    }
};
