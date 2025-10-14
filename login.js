// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Password toggle functionality
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle eye icon
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Demo account buttons
    const demoButtons = document.querySelectorAll('.demo-btn');

    demoButtons.forEach(button => {
        button.addEventListener('click', function () {
            const email = this.getAttribute('data-email');
            const password = this.getAttribute('data-password');

            // Fill the form with demo credentials
            document.getElementById('email').value = email;
            document.getElementById('password').value = password;

            // Show success message
            showDemoMessage('Demo credentials filled! You can now click "Sign In" to proceed.');
        });
    });

    // Form submission
    const loginForm = document.getElementById('loginForm');
    const loginButton = loginForm?.querySelector('.login-btn');
    const btnText = loginButton?.querySelector('.btn-text');
    const btnLoader = loginButton?.querySelector('.btn-loader');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate form
            if (validateLoginForm()) {
                // Show loading state
                if (btnText && btnLoader) {
                    btnText.style.display = 'none';
                    btnLoader.style.display = 'block';
                }

                if (loginButton) {
                    loginButton.disabled = true;
                }

                // Simulate API call (replace with actual API call)
                setTimeout(() => {
                    // For demo purposes, always show success
                    showLoginSuccess();

                    // Reset form and button state
                    if (btnText && btnLoader) {
                        btnText.style.display = 'block';
                        btnLoader.style.display = 'none';
                    }

                    if (loginButton) {
                        loginButton.disabled = false;
                    }
                }, 2000);
            }
        });
    }

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');

    socialButtons.forEach(button => {
        button.addEventListener('click', function () {
            const platform = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
            showSocialLoginMessage(platform);
        });
    });

    // Form validation
    function validateLoginForm() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        let isValid = true;

        // Clear previous errors
        clearErrors();

        // Email validation
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show error message
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const inputGroup = field.closest('.input-group');

        // Add error class to input
        field.classList.add('error');

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '0.5rem';

        // Insert after input group
        inputGroup.parentNode.insertBefore(errorElement, inputGroup.nextSibling);
    }

    // Clear all errors
    function clearErrors() {
        // Remove error classes
        document.querySelectorAll('.error').forEach(element => {
            element.classList.remove('error');
        });

        // Remove error messages
        document.querySelectorAll('.error-message').forEach(element => {
            element.remove();
        });
    }

    // Show demo message
    function showDemoMessage(message) {
        showMessage(message, 'success');
    }

    // Show social login message
    function showSocialLoginMessage(platform) {
        showMessage(`${platform} login would be implemented in a real application`, 'info');
    }

    // Show login success message
    function showLoginSuccess() {
        showMessage('Login successful! Redirecting to dashboard...', 'success');

        // Redirect to dashboard (simulated)
        setTimeout(() => {
            // In a real application, this would redirect to the actual dashboard
            // window.location.href = 'dashboard.html';

            // For demo, show a message
            showMessage('Welcome to your student dashboard!', 'success');
        }, 1500);
    }

    // Generic message display function
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.textContent = message;

        // Style based on type
        const styles = {
            success: {
                background: '#d4edda',
                color: '#155724',
                border: '1px solid #c3e6cb'
            },
            error: {
                background: '#f8d7da',
                color: '#721c24',
                border: '1px solid #f5c6cb'
            },
            info: {
                background: '#cce7ff',
                color: '#004085',
                border: '1px solid #b3d7ff'
            }
        };

        Object.assign(messageElement.style, {
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: '600',
            ...styles[type]
        });

        // Insert before the form
        const form = document.querySelector('.login-form');
        form.parentNode.insertBefore(messageElement, form);

        // Auto remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    // Add CSS for error state
    const style = document.createElement('style');
    style.textContent = `
        .input-group input.error {
            border-color: #e74c3c;
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
        }
        
        .form-message {
            animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});