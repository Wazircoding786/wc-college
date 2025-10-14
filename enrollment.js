// Enrollment Page JavaScript - Enhanced Version
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all enrollment page functionality
    initEnrollmentPage();
});

function initEnrollmentPage() {
    // FAQ Toggle Functionality with Enhanced Animations
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        const answer = item.querySelector('.faq-answer');

        // Add initial styles for animation
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
        answer.style.opacity = '0';

        question.addEventListener('click', function () {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherToggle = otherItem.querySelector('.faq-toggle');
                    otherItem.classList.remove('active');
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.opacity = '0';
                    otherToggle.textContent = '+';
                }
            });

            // Toggle current FAQ item
            const isActive = item.classList.contains('active');

            if (isActive) {
                // Close current item
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                toggle.textContent = '+';
                item.classList.remove('active');
            } else {
                // Open current item
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                toggle.textContent = '−';
                item.classList.add('active');
            }
        });

        // Add hover effects
        question.addEventListener('mouseenter', function () {
            if (!item.classList.contains('active')) {
                question.style.transform = 'translateX(5px)';
                question.style.transition = 'transform 0.2s ease';
            }
        });

        question.addEventListener('mouseleave', function () {
            question.style.transform = 'translateX(0)';
        });
    });

    // Enhanced Form Validation and Interaction
    const enrollmentForm = document.querySelector('.enrollment-form');
    const requiredFields = enrollmentForm ? enrollmentForm.querySelectorAll('[required]') : [];

    // Add input event listeners for real-time validation
    if (enrollmentForm) {
        // Enhanced real-time form validation
        const allInputs = enrollmentForm.querySelectorAll('input, select, textarea');

        allInputs.forEach(field => {
            // Add focus effects
            field.addEventListener('focus', function () {
                this.parentElement.classList.add('focused');
                removeFieldError(this);
            });

            field.addEventListener('blur', function () {
                this.parentElement.classList.remove('focused');
                validateField(this);
            });

            // Real-time validation for specific fields
            if (field.type === 'email' || field.type === 'tel' || field.name === 'cnic') {
                field.addEventListener('input', function () {
                    validateField(this);
                });
            }
        });

        // Course selection change handler
        const courseSelect = document.getElementById('course');
        if (courseSelect) {
            courseSelect.addEventListener('change', function () {
                highlightSelectedCourse(this);
                updateFormBasedOnCourse(this.value);
            });
        }

        // Installment option handler
        const installmentCheckbox = document.getElementById('installment');
        if (installmentCheckbox) {
            installmentCheckbox.addEventListener('change', function () {
                toggleInstallmentOptions(this.checked);
            });
        }

        // Enhanced form submission
        enrollmentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate all required fields
            let isValid = true;
            const firstInvalidField = validateAllFields();

            // Check terms agreement
            const termsCheckbox = document.getElementById('terms');
            if (!termsCheckbox.checked) {
                showNotification('Please agree to the Terms and Conditions to continue.', 'error');
                termsCheckbox.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                termsCheckbox.focus();
                isValid = false;
            }

            if (isValid) {
                submitEnrollmentForm();
            } else if (firstInvalidField) {
                // Scroll to first error
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidField.focus();
            }
        });

        // Add character counters for textareas
        const textareas = enrollmentForm.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            addCharacterCounter(textarea);
        });

        // Add input formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', formatPhoneNumber);
        }

        const cnicInput = document.getElementById('cnic');
        if (cnicInput) {
            cnicInput.addEventListener('input', formatCNIC);
        }
    }

    // Process Steps Animation
    animateProcessSteps();

    // Contact Information Hover Effects
    addContactHoverEffects();

    // Smooth scroll for anchor links
    addSmoothScroll();

    // Add loading animation for form submission
    addSubmitButtonLoader();

    console.log('Enrollment page initialized with enhanced functionality!');
}

// Enhanced Field Validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.previousElementSibling ? field.previousElementSibling.textContent.replace('*', '').trim() : 'This field';

    // Remove any existing error styling
    field.classList.remove('error');
    field.classList.remove('success');

    if (field.hasAttribute('required') && value === '') {
        field.classList.add('error');
        showFieldError(field, `${fieldName} is required`);
        return false;
    }

    // Email validation
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }

    // Phone validation(basic)
    if (field.type === 'tel' && value !== '') {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            field.classList.add('error');
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }

    // CNIC validation (Pakistan format)
    if (field.name === 'cnic' && value !== '') {
        const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
        if (!cnicRegex.test(value)) {
            field.classList.add('error');
            showFieldError(field, 'Please enter CNIC in format: 12345-1234567-1');
            return false;
        }
    }

    // If field passes validation
    if (value !== '') {
        field.classList.add('success');
    }

    removeFieldError(field);
    return true;
}

// Validate all form fields
function validateAllFields() {
    let firstInvalidField = null;
    const requiredFields = document.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField(field) && !firstInvalidField) {
            firstInvalidField = field;
        }
    });

    return firstInvalidField;
}

// Enhanced Error Display
function showFieldError(field, message) {
    removeFieldError(field);

    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.innerHTML = `
        <span class="error-icon">⚠</span>
        <span class="error-text">${message}</span>
    `;

    field.parentNode.appendChild(errorElement);

    // Add shake animation to field
    field.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Course Selection Enhancement
function highlightSelectedCourse(selectElement) {
    // Remove highlight from all options
    const options = selectElement.querySelectorAll('option');
    options.forEach(option => {
        option.classList.remove('selected-course');
    });

    // Highlight selected option
    if (selectElement.value) {
        selectElement.options[selectElement.selectedIndex].classList.add('selected-course');
    }
}

function updateFormBasedOnCourse(courseValue) {
    // You can add logic here to show/hide fields based on course selection
    // For example, show advanced options for programming courses
    const experienceField = document.querySelector('[name="experience"]');

    if (courseValue === 'fullstack' || courseValue === 'java') {
        // Suggest intermediate/advanced for advanced courses
        if (experienceField) {
            // You could add visual cues here
        }
    }
}

// Installment Options
function toggleInstallmentOptions(show) {
    let installmentSection = document.querySelector('.installment-options');

    if (show && !installmentSection) {
        installmentSection = document.createElement('div');
        installmentSection.className = 'installment-options';
        installmentSection.innerHTML = `
            <div class="form-group">
                <label for="installmentPlan">Preferred Installment Plan</label>
                <select id="installmentPlan" name="installmentPlan">
                    <option value="">-- Select Plan --</option>
                    <option value="2-months">2 Months (50% + 50%)</option>
                    <option value="3-months">3 Months (40% + 30% + 30%)</option>
                    <option value="4-months">4 Months (25% each month)</option>
                </select>
            </div>
            <p class="installment-note">Our team will contact you to discuss installment details and payment schedule.</p>
        `;

        const paymentFieldset = document.querySelector('fieldset:has(.payment-options)');
        paymentFieldset.appendChild(installmentSection);

        // Animate in
        installmentSection.style.opacity = '0';
        installmentSection.style.transform = 'translateY(20px)';
        installmentSection.style.transition = 'all 0.5s ease';

        setTimeout(() => {
            installmentSection.style.opacity = '1';
            installmentSection.style.transform = 'translateY(0)';
        }, 10);
    } else if (!show && installmentSection) {
        // Animate out
        installmentSection.style.opacity = '0';
        installmentSection.style.transform = 'translateY(20px)';
        setTimeout(() => {
            installmentSection.remove();
        }, 500);
    }
}

// Character Counter for Textareas
function addCharacterCounter(textarea) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.fontSize = '0.8rem';
    counter.style.color = '#666';
    counter.style.textAlign = 'right';
    counter.style.marginTop = '0.5rem';

    textarea.parentNode.appendChild(counter);

    function updateCounter() {
        const count = textarea.value.length;
        const maxLength = textarea.getAttribute('maxlength') || 1000;
        counter.textContent = `${count}/${maxLength} characters`;

        if (count > maxLength * 0.8) {
            counter.style.color = '#e67e22';
        } else {
            counter.style.color = '#666';
        }

        if (count > maxLength) {
            counter.style.color = '#e74c3c';
            textarea.classList.add('error');
        } else {
            textarea.classList.remove('error');
        }
    }

    textarea.addEventListener('input', updateCounter);
    updateCounter();
}

// Input Formatting Functions
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.startsWith('0')) {
        value = value.substring(1);
    }

    if (value.length <= 3) {
        e.target.value = value;
    } else if (value.length <= 6) {
        e.target.value = value.substring(0, 3) + '-' + value.substring(3);
    } else if (value.length <= 10) {
        e.target.value = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6);
    } else {
        e.target.value = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10);
    }
}

function formatCNIC(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length <= 5) {
        e.target.value = value;
    } else if (value.length <= 12) {
        e.target.value = value.substring(0, 5) + '-' + value.substring(5);
    } else {
        e.target.value = value.substring(0, 5) + '-' + value.substring(5, 12) + '-' + value.substring(12, 13);
    }
}

// Process Steps Animation
function animateProcessSteps() {
    const steps = document.querySelectorAll('.step');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(steps).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });

    steps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px) scale(0.9)';
        step.style.transition = 'all 0.6s ease';
        observer.observe(step);
    });
}

// Contact Information Hover Effects
function addContactHoverEffects() {
    const contactItems = document.querySelectorAll('.contact-item');

    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        });

        item.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
}

// Smooth Scroll Functionality
function addSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Submit Button Loader
function addSubmitButtonLoader() {
    const submitBtn = document.querySelector('.submit-btn');

    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            // This will be used during form submission
        });
    }
}

// Enhanced Form Submission
function submitEnrollmentForm() {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Submitting...';
    submitBtn.disabled = true;

    // Simulate API call (replace with actual fetch/AJAX call)
    setTimeout(() => {
        // Show success message
        showNotification('🎉 Thank you for your enrollment application! Our team will contact you within 24 hours.', 'success');

        // Reset form
        enrollmentForm.reset();

        // Reset submit button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Track successful enrollment attempt
        trackEnrollmentEvent('enrollment_submitted');
    }, 2000);
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    const styles = `
        .form-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.5s ease;
            border-left: 4px solid;
        }
        .form-notification.success {
            border-left-color: #27ae60;
            background: linear-gradient(135deg, #f1f8e9, #e8f5e8);
        }
        .form-notification.error {
            border-left-color: #e74c3c;
            background: linear-gradient(135deg, #ffebee, #fce4ec);
        }
        .form-notification.info {
            border-left-color: #3498db;
            background: linear-gradient(135deg, #e3f2fd, #e1f5fe);
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .notification-icon {
            font-size: 1.2rem;
        }
        .notification-message {
            flex: 1;
            font-weight: 500;
        }
        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: #666;
        }
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.5s ease reverse';
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);

    // Close button event
    notification.querySelector('.notification-close').addEventListener('click', function () {
        notification.remove();
    });
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

// Analytics Tracking
function trackEnrollmentEvent(eventName, data = {}) {
    console.log(`Enrollment Event: ${eventName}`, data);
    // Here you can integrate with Google Analytics, Facebook Pixel, etc.
    // Example:
    // gtag('event', eventName, data);
}

// Add enhanced CSS for form states
const enhancedStyles = `
    .form-group.focused label {
        color: #3498db;
        font-weight: 600;
    }
    .form-group input.success,
    .form-group select.success,
    .form-group textarea.success {
        border-color: #27ae60;
        box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
    }
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    .field-error {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #e74c3c;
        font-size: 0.9rem;
        margin-top: 0.5rem;
        padding: 0.5rem;
        background: rgba(231, 76, 60, 0.05);
        border-radius: 4px;
        border-left: 3px solid #e74c3c;
    }
    .error-icon {
        font-size: 1rem;
    }
    .installment-options {
        margin-top: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #3498db;
    }
    .installment-note {
        font-size: 0.9rem;
        color: #666;
        margin-top: 0.5rem;
        font-style: italic;
    }
    option.selected-course {
        background: #e3f2fd;
        font-weight: 600;
    }
`;

// Add enhanced styles to document
const enhancedStyleSheet = document.createElement('style');
enhancedStyleSheet.textContent = enhancedStyles;
document.head.appendChild(enhancedStyleSheet);