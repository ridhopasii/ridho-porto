// Toast Notification System
// Provides accessible, animated toast notifications

(function() {
    'use strict';

    // Toast container
    let toastContainer = null;

    function createContainer() {
        if (toastContainer) return toastContainer;

        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        toastContainer.setAttribute('aria-live', 'polite');
        toastContainer.setAttribute('aria-atomic', 'false');
        document.body.appendChild(toastContainer);

        return toastContainer;
    }

    /**
     * Show a toast notification
     * @param {string} message - The message to display
     * @param {string} type - Type of toast: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in milliseconds (0 = persistent)
     * @param {object} options - Additional options
     */
    function showToast(message, type = 'info', duration = 4000, options = {}) {
        const container = createContainer();

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

        // Icon based on type
        const icons = {
            success: 'check-circle',
            error: 'alert-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        const icon = icons[type] || icons.info;

        // Build toast content
        toast.innerHTML = `
            <div class="toast-icon">
                <i data-lucide="${icon}"></i>
            </div>
            <div class="toast-content">
                ${options.title ? `<div class="toast-title">${options.title}</div>` : ''}
                <div class="toast-message">${message}</div>
            </div>
            ${duration > 0 ? '<button class="toast-close" aria-label="Close notification"><i data-lucide="x"></i></button>' : ''}
        `;

        // Add to container
        container.appendChild(toast);

        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('toast-show');
        });

        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                removeToast(toast);
            });
        }

        // Auto-dismiss
        if (duration > 0) {
            setTimeout(() => {
                removeToast(toast);
            }, duration);
        }

        // Announce to screen readers
        if (window.A11y && window.A11y.announce) {
            const priority = type === 'error' ? 'assertive' : 'polite';
            window.A11y.announce(message, priority);
        }

        return toast;
    }

    function removeToast(toast) {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }

            // Remove container if empty
            if (toastContainer && toastContainer.children.length === 0) {
                toastContainer.remove();
                toastContainer = null;
            }
        }, 300);
    }

    // Convenience methods
    function success(message, duration, options) {
        return showToast(message, 'success', duration, options);
    }

    function error(message, duration, options) {
        return showToast(message, 'error', duration, options);
    }

    function warning(message, duration, options) {
        return showToast(message, 'warning', duration, options);
    }

    function info(message, duration, options) {
        return showToast(message, 'info', duration, options);
    }

    // Loading toast (persistent until dismissed)
    function loading(message, options = {}) {
        const toast = showToast(message, 'info', 0, {
            ...options,
            title: options.title || 'Loading...'
        });

        // Add loading spinner
        const icon = toast.querySelector('.toast-icon i');
        if (icon) {
            icon.setAttribute('data-lucide', 'loader-2');
            icon.classList.add('animate-spin');
            if (window.lucide) {
                lucide.createIcons();
            }
        }

        return {
            dismiss: () => removeToast(toast),
            update: (newMessage, newType = 'success') => {
                const messageEl = toast.querySelector('.toast-message');
                if (messageEl) {
                    messageEl.textContent = newMessage;
                }
                
                // Update type
                toast.className = `toast toast-${newType} toast-show`;
                
                // Update icon
                const icons = {
                    success: 'check-circle',
                    error: 'alert-circle',
                    warning: 'alert-triangle',
                    info: 'info'
                };
                
                const iconEl = toast.querySelector('.toast-icon i');
                if (iconEl) {
                    iconEl.classList.remove('animate-spin');
                    iconEl.setAttribute('data-lucide', icons[newType] || icons.info);
                    if (window.lucide) {
                        lucide.createIcons();
                    }
                }

                // Add close button if not present
                if (!toast.querySelector('.toast-close')) {
                    const closeBtn = document.createElement('button');
                    closeBtn.className = 'toast-close';
                    closeBtn.setAttribute('aria-label', 'Close notification');
                    closeBtn.innerHTML = '<i data-lucide="x"></i>';
                    closeBtn.addEventListener('click', () => removeToast(toast));
                    toast.appendChild(closeBtn);
                    if (window.lucide) {
                        lucide.createIcons();
                    }
                }

                // Auto-dismiss after update
                setTimeout(() => removeToast(toast), 4000);
            }
        };
    }

    // Promise wrapper for async operations
    async function promise(promiseFunc, messages = {}) {
        const loadingToast = loading(messages.loading || 'Processing...');

        try {
            const result = await promiseFunc();
            loadingToast.update(messages.success || 'Success!', 'success');
            return result;
        } catch (err) {
            loadingToast.update(messages.error || 'An error occurred', 'error');
            throw err;
        }
    }

    // Export to global scope
    window.Toast = {
        show: showToast,
        success,
        error,
        warning,
        info,
        loading,
        promise
    };

})();
