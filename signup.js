// Sign Up Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Multi-step form functionality
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    let currentStep = 1;

    // Next button functionality
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function () {
            const nextStep = parseInt(this.getAttribute('data-next'));
            if (validateStep(currentStep)) {
                goToStep(nextStep);
            }
        });
    });

    // Previous button functionality
    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', function () {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            goToStep(prevStep);
        });
    });

    function goToStep(step) {
        // Hide all steps
        steps.forEach(s => s.classList.remove('active'));

        // Show current step
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');

        // Update progress steps
        progressSteps.forEach(s => {
            const stepNum = parseInt(s.getAttribute('data-step'));
            if (stepNum <= step) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });

        currentStep = step;
    }

    // Password toggle functionality
    const passwordToggles = document.querySelectorAll('.password-toggle');

    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.parentNode.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

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
    });

    // Username availability check
    const usernameInput = document.getElementById('username');
    const usernameAvailability = document.querySelector('.username-availability');

    if (usernameInput) {
        let usernameTimeout;

        usernameInput.addEventListener('input', function () {
            clearTimeout(usernameTimeout);
            usernameTimeout = setTimeout(() => {
                checkUsernameAvailability(this.value);
            }, 500);
        });
    }

    // Password strength checker
    const passwordInput = document.getElementById('password');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            checkPasswordStrength(this.value);
        });
    }

    // Password confirmation check
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordMatch = document.querySelector('.password-match');

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function () {
            checkPasswordMatch();
        });
    }

    // Form submission
    const signupForm = document.getElementById('signupForm');
    const submitButton = signupForm?.querySelector('.submit-btn');
    const btnText = submitButton?.querySelector('.btn-text');
    const btnLoader = submitButton?.querySelector('.btn-loader');

    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate all steps
            if (validateStep(1) && validateStep(2) && validateStep(3)) {
                // Show loading state
                if (btnText && btnLoader) {
                    btnText.style.display = 'none';
                    btnLoader.style.display = 'block';
                }

                if (submitButton) {
                    submitButton.disabled = true;
                }

                // Simulate API call (replace with actual API call)
                setTimeout(() => {
                    showSignupSuccess();

                    // Reset form and button state
                    if (btnText && btnLoader) {
                        btnText.style.display = 'block';
                        btnLoader.style.display = 'none';
                    }

                    if (submitButton) {
                        submitButton.disabled = false;
                    }
                }, 3000);
            } else {
                // Go to first step with error
                let errorStep = 1;
                if (!validateStep(1)) errorStep = 1;
                else if (!validateStep(2)) errorStep = 2;
                else if (!validateStep(3)) errorStep = 3;

                goToStep(errorStep);
                showMessage('Please fix the errors in the form before submitting.', 'error');
            }
        });
    }

    // Step validation function
    function validateStep(step) {
        let isValid = true;

        switch (step) {
            case 1:
                // Personal information validation
                const firstName = document.getElementById('firstName').value.trim();
                const lastName = document.getElementById('lastName').value.trim();
                const email = document.getElementById('email').value.trim();
                const phone = document.getElementById('phone').value.trim();

                clearStepErrors(1);

                if (!firstName) {
                    showStepError('firstName', 'First name is required');
                    isValid = false;
                }

                if (!lastName) {
                    showStepError('lastName', 'Last name is required');
                    isValid = false;
                }

                if (!email) {
                    showStepError('email', 'Email is required');
                    isValid = false;
                } else if (!isValidEmail(email)) {
                    showStepError('email', 'Please enter a valid email address');
                    isValid = false;
                }

                if (!phone) {
                    showStepError('phone', 'Phone number is required');
                    isValid = false;
                }
                break;

            case 2:
                // Account details validation
                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value.trim();
                const confirmPassword = document.getElementById('confirmPassword').value.trim();

                clearStepErrors(2);

                if (!username) {
                    showStepError('username', 'Username is required');
                    isValid = false;
                } else if (username.length < 3) {
                    showStepError('username', 'Username must be at least 3 characters');
                    isValid = false;
                }

                if (!password) {
                    showStepError('password', 'Password is required');
                    isValid = false;
                } else if (password.length < 6) {
                    showStepError('password', 'Password must be at least 6 characters');
                    isValid = false;
                }

                if (!confirmPassword) {
                    showStepError('confirmPassword', 'Please confirm your password');
                    isValid = false;
                } else if (password !== confirmPassword) {
                    showStepError('confirmPassword', 'Passwords do not match');
                    isValid = false;
                }
                break;

            case 3:
                // Course interest validation
                const courseInterest = document.getElementById('courseInterest').value;
                const terms = document.getElementById('terms').checked;

                clearStepErrors(3);

                if (!courseInterest) {
                    showStepError('courseInterest', 'Please select a course interest');
                    isValid = false;
                }

                if (!terms) {
                    showStepError('terms', 'You must agree to the terms and conditions');
                    isValid = false;
                }
                break;
        }

        return isValid;
    }

    // Username availability check
    function checkUsernameAvailability(username) {
        if (username.length < 3) {
            usernameAvailability.textContent = '';
            usernameAvailability.className = 'username-availability';
            return;
        }

        // Simulate API call
        setTimeout(() => {
            // For demo purposes, check against some taken usernames
            const takenUsernames = ['admin', 'student', 'teacher', 'test', 'demo'];

            if (takenUsernames.includes(username.toLowerCase())) {
                usernameAvailability.textContent = 'Username is already taken';
                usernameAvailability.className = 'username-availability username-taken';
            } else {
                usernameAvailability.textContent = 'Username is available';
                usernameAvailability.className = 'username-availability username-available';
            }
        }, 500);
    }

    // Password strength checker
    function checkPasswordStrength(password) {
        let strength = 0;
        let feedback = '';

        if (password.length >= 6) strength += 25;
        if (password.match(/[a-z]+/)) strength += 25;
        if (password.match(/[A-Z]+/)) strength += 25;
        if (password.match(/[0-9]+/)) strength += 25;

        strengthFill.style.width = strength + '%';

        if (strength < 25) {
            strengthFill.style.background = '#e74c3c';
            feedback = 'Very Weak';
        } else if (strength < 50) {
            strengthFill.style.background = '#e67e22';
            feedback = 'Weak';
        } else if (strength < 75) {
            strengthFill.style.background = '#f1c40f';
            feedback = 'Good';
        } else {
            strengthFill.style.background = '#27ae60';
            feedback = 'Strong';
        }

        strengthText.textContent = `Password strength: ${feedback}`;
    }

    // Password match checker
    function checkPasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!confirmPassword) {
            passwordMatch.textContent = '';
            passwordMatch.className = 'password-match';
            return;
        }

        if (password === confirmPassword) {
            passwordMatch.textContent = 'Passwords match';
            passwordMatch.className = 'password-match valid';
        } else {
            passwordMatch.textContent = 'Passwords do not match';
            passwordMatch.className = 'password-match invalid';
        }
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show step error
    function showStepError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const inputGroup = field.closest('.input-group') || field.closest('.form-group');

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

    // Clear step errors
    function clearStepErrors(step) {
        const stepElement = document.querySelector(`.form-step[data-step="${step}"]`);

        // Remove error classes
        stepElement.querySelectorAll('.error').forEach(element => {
            element.classList.remove('error');
        });

        // Remove error messages
        stepElement.querySelectorAll('.error-message').forEach(element => {
            element.remove();
        });
    }

    // Show signup success message
    function showSignupSuccess() {
        showMessage('Account created successfully! Welcome to Wazir Coding Academy.', 'success');

        // Redirect to login page (simulated)
        setTimeout(() => {
            // In a real application, this would redirect to the dashboard or login page
            // window.location.href = 'login.html';

            // For demo, show a success message
            showMessage('You can now log in with your new account!', 'success');

            // Reset form
            signupForm.reset();
            goToStep(1);
        }, 2000);
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
        const form = document.querySelector('.signup-form');
        form.parentNode.insertBefore(messageElement, form);

        // Auto remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    // Add CSS for error state
    const style = document.createElement('style');
    style.textContent = `
        .input-group input.error,
        .input-group select.error {
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