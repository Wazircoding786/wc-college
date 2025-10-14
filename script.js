// script.js - Wazir Coding College Website JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // ========== MOBILE MENU TOGGLE FUNCTIONALITY ==========
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function () {
            nav.classList.toggle('active');

            // Change emoji based on state
            if (nav.classList.contains('active')) {
                this.textContent = '✕';
            } else {
                this.textContent = '☰';
            }
        });

        // Close menu when clicking on links (mobile)
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('active');
                    menuToggle.textContent = '☰';
                }
            });
        });

        // Close menu when window is resized to desktop size
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                nav.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    }

    // ========== SMOOTH SCROLLING FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });

    // ========== CONTACT FORM SUBMISSION ==========
    const contactForm = document.querySelector('form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('.submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual AJAX call)
            setTimeout(() => {
                // Show success message
                showNotification('Thank you for your message! We will get back to you soon.', 'success');

                // Reset form
                contactForm.reset();

                // Restore button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // ========== COURSE CARD INTERACTIONS ==========
    const courseCards = document.querySelectorAll('.card');

    courseCards.forEach(card => {
        // Add click event to "Learn More" buttons
        const learnMoreBtn = card.querySelector('.btnn');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', function () {
                const courseTitle = card.querySelector('h3').textContent;
                showNotification(`Redirecting to ${courseTitle} details...`, 'info');

                // In a real application, this would redirect to the course page
                // window.location.href = 'courses.html#' + courseTitle.toLowerCase().replace(/\s+/g, '-');
            });
        }

        // Enhanced hover effects
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
        });
    });

    // ========== GET STARTED BUTTON ANIMATION ==========
    const getStartedBtn = document.querySelector('.getstart button');

    if (getStartedBtn) {
        getStartedBtn.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });

        getStartedBtn.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    }

    // ========== SUCCESS STORIES CAROUSEL FUNCTIONALITY ==========
    const successCards = document.querySelectorAll('.all-section:last-of-type .card');

    if (successCards.length > 0) {
        // Add click to expand functionality for success stories
        successCards.forEach(card => {
            card.addEventListener('click', function () {
                // Remove active class from all cards
                successCards.forEach(c => c.classList.remove('active'));

                // Add active class to clicked card
                this.classList.add('active');

                // Scroll to the card if it's not fully visible
                this.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            });
        });
    }

    // ========== SCROLL ANIMATIONS ==========
    // Add fade-in animation when elements come into view
    const animatedElements = document.querySelectorAll('.all-section, .card, .head');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Set initial state for animated elements
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ========== FOOTER SOCIAL MEDIA ICONS HOVER EFFECT ==========
    const socialIcons = document.querySelectorAll('.social-icons a');

    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.2)';
        });

        icon.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // ========== ACTIVE NAV LINK HIGHLIGHTING ==========
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setActiveNavLink();

    // ========== UTILITY FUNCTIONS ==========

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            transform: 'translateX(150%)',
            transition: 'transform 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db',
            warning: '#f39c12'
        };

        notification.style.background = colors[type] || colors.info;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);

        // Allow manual dismissal
        notification.addEventListener('click', function () {
            this.style.transform = 'translateX(150%)';
            setTimeout(() => {
                if (this.parentNode) {
                    this.remove();
                }
            }, 300);
        });
    }

    // ========== BACK TO TOP BUTTON ==========
    // Create back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');

    // Style the button
    Object.assign(backToTopBtn.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'var(--accent-color)',
        color: 'var(--primary-color)',
        border: 'none',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        opacity: '0',
        visibility: 'hidden',
        transition: 'all 0.3s ease',
        zIndex: '999'
    });

    document.body.appendChild(backToTopBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ========== ENHANCED FORM VALIDATION ==========
    const formInputs = document.querySelectorAll('input, textarea');

    formInputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');

            // Validate on blur
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }

            // Email validation
            if (this.type === 'email' && this.value.trim() && !isValidEmail(this.value)) {
                this.classList.add('error');
            }
        });
    });

    // ========== KEYBOARD SHORTCUTS ==========
    document.addEventListener('keydown', function (e) {
        // Escape key to close mobile menu
        if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            if (menuToggle) {
                menuToggle.textContent = '☰';
            }
        }

        // Ctrl + / to focus search (if you add search functionality)
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            // Focus on search input if it exists
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });

    // ========== PERFORMANCE OPTIMIZATIONS ==========
    // Lazy load images that are not in viewport initially
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    console.log('Wazir Coding College website initialized successfully!');
});

// ========== ADDITIONAL GLOBAL FUNCTIONS ==========

// Function to track user engagement (for analytics)
function trackUserAction(action, details = {}) {
    // In a real application, this would send data to analytics service
    console.log(`User action: ${action}`, details);
}

// Function to share page (for social sharing)
function sharePage(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };

    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// Export functions for global use (if needed)
window.WazirCodingCollege = {
    trackUserAction,
    sharePage
};