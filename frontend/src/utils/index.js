/**
 * App Utilities
 * Common helper functions used throughout the application.
 */

/**
 * Formats a date string to a more readable format.
 * Example: '2024-10-24' -> 'Oct 24'
 */
export const formatDate = (dateString) => {
    // This is a simple mock-implementation.
    // In a real app, you might use date-fns or native Intl.DateTimeFormat.
    return dateString;
};

/**
 * Capitalizes the first letter of a string.
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};
