import { useEffect } from 'react';

/**
 * Custom hook for handling keyboard shortcuts
 * @param {string} key - The key to listen for (e.g., 'n', 'Escape', 'Enter')
 * @param {Function} callback - The function to call when the shortcut is pressed
 * @param {Object} options - Options for the shortcut
 * @param {boolean} options.ctrlKey - Whether Ctrl key must be pressed
 * @param {boolean} options.shiftKey - Whether Shift key must be pressed
 * @param {boolean} options.altKey - Whether Alt key must be pressed
 * @param {boolean} options.preventDefault - Whether to call preventDefault()
 */
const useKeyboardShortcut = (key, callback, options = {}) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            const {
                ctrlKey = false,
                shiftKey = false,
                altKey = false,
                preventDefault = true
            } = options;

            if (
                event.key.toLowerCase() === key.toLowerCase() &&
                event.ctrlKey === ctrlKey &&
                event.shiftKey === shiftKey &&
                event.altKey === altKey
            ) {
                if (preventDefault) {
                    event.preventDefault();
                }
                callback();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [key, callback, options]);
};

export default useKeyboardShortcut;
