// Accessibility Enhancement Script
// Handles keyboard navigation, focus management, and ARIA live regions

(function() {
    'use strict';

    // Detect keyboard navigation
    let isUsingKeyboard = false;

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            isUsingKeyboard = true;
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        isUsingKeyboard = false;
        document.body.classList.remove('keyboard-nav');
    });

    // Focus trap for modals
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        });
    }

    // Announce to screen readers
    function announce(message, priority = 'polite') {
        const announcer = document.getElementById('aria-announcer') || createAnnouncer();
        announcer.setAttribute('aria-live', priority);
        announcer.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }

    function createAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'aria-announcer';
        announcer.className = 'sr-only';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);
        return announcer;
    }

    // Skip navigation link
    const skipLink = document.querySelector('.skip-nav');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
                target.addEventListener('blur', function() {
                    this.removeAttribute('tabindex');
                }, { once: true });
            }
        });
    }

    // Enhanced button accessibility
    document.querySelectorAll('button, [role="button"]').forEach(button => {
        // Ensure buttons have proper ARIA labels
        if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
            console.warn('Button without accessible label:', button);
        }

        // Add keyboard support for role="button"
        if (button.getAttribute('role') === 'button' && button.tagName !== 'BUTTON') {
            button.setAttribute('tabindex', '0');
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
    });

    // Enhanced link accessibility
    document.querySelectorAll('a').forEach(link => {
        // Warn about links without text
        if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
            console.warn('Link without accessible text:', link);
        }

        // Add external link indicators
        if (link.hostname && link.hostname !== window.location.hostname) {
            if (!link.getAttribute('aria-label')) {
                const text = link.textContent.trim();
                link.setAttribute('aria-label', `${text} (opens in new window)`);
            }
        }
    });

    // Form accessibility enhancements
    document.querySelectorAll('input, textarea, select').forEach(field => {
        // Ensure form fields have labels
        const id = field.id;
        if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (!label && !field.getAttribute('aria-label')) {
                console.warn('Form field without label:', field);
            }
        }

        // Add aria-invalid for validation
        field.addEventListener('invalid', function() {
            this.setAttribute('aria-invalid', 'true');
        });

        field.addEventListener('input', function() {
            if (this.validity.valid) {
                this.removeAttribute('aria-invalid');
            }
        });
    });

    // Reduced motion support
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion() {
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduce-motion');
            // Disable AOS animations
            if (window.AOS) {
                AOS.init({ disable: true });
            }
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }

    handleReducedMotion();
    prefersReducedMotion.addEventListener('change', handleReducedMotion);

    // High contrast mode detection
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    function handleHighContrast() {
        if (prefersHighContrast.matches) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }

    handleHighContrast();
    prefersHighContrast.addEventListener('change', handleHighContrast);

    // Heading hierarchy check (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.substring(1));
            if (level - lastLevel > 1) {
                console.warn(`Heading hierarchy skip: ${heading.tagName} after H${lastLevel}`, heading);
            }
            lastLevel = level;
        });
    }

    // Export functions for global use
    window.A11y = {
        announce,
        trapFocus,
        isUsingKeyboard: () => isUsingKeyboard
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            announce('Page loaded', 'polite');
        });
    }

})();
