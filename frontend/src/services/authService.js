/**
 * Auth Service
 * Handles mock authentication processes.
 * Later, this can be updated to use Axios or Fetch to call a real backend.
 */

export const authService = {
    login: async (credentials) => {
        // Simulating a network request
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    user: { name: 'Alex Rivera', plan: 'Pro' },
                    token: 'mock-jwt-token'
                });
            }, 1000);
        });
    },

    logout: async () => {
        // Simulating cleanup if needed
        return Promise.resolve();
    }
};
