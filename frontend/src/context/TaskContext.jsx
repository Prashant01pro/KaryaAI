import React, { createContext, useContext, useState, useEffect } from 'react';
import { taskService } from '../features/tasks/services/taskService';
import { useAuth } from '../hooks/useAuth';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    const openModal = (task = null) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTaskToEdit(null);
    };
    const [error, setError] = useState(null);

    const fetchTasks = async (filters = {}) => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const response = await taskService.getTasks(filters);
            setTasks(response.data.tasks);
            setError(null);
        } catch (err) {
            setError('Failed to fetch tasks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (taskData) => {
        try {
            const response = await taskService.createTask(taskData);
            setTasks((prev) => [response.data.task, ...prev]);
            return response.data.task;
        } catch (err) {
            console.error('Failed to add task', err);
            throw err;
        }
    };

    const updateTask = async (taskId, taskData) => {
        try {
            const response = await taskService.updateTask(taskId, taskData);
            setTasks((prev) => 
                prev.map((t) => (t._id === taskId ? response.data.task : t))
            );
            return response.data.task;
        } catch (err) {
            console.error('Failed to update task', err);
            throw err;
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await taskService.deleteTask(taskId);
            setTasks((prev) => prev.filter((t) => t._id !== taskId));
        } catch (err) {
            console.error('Failed to delete task', err);
            throw err;
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchTasks();
        } else {
            setTasks([]);
        }
    }, [isAuthenticated]);

    return (
        <TaskContext.Provider value={{ 
            tasks, 
            loading, 
            error, 
            isModalOpen,
            taskToEdit,
            openModal,
            closeModal,
            fetchTasks, 
            addTask, 
            updateTask, 
            deleteTask 
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};
