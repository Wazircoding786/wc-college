// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            item.classList.toggle('active');
        });
    });

    // Contact Form Validation and Enhancement
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        // Real-time form validation
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateContactField(this);
            });
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all required fields
            let isValid = true;
            requiredFields.forEach(field => {
                if (!validateContactField(field)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Show success message (in a real application, this would submit to a server)
                showFormSuccess();
                
                // Reset form
                contactForm.reset();
            }
        });
    }

    // Contact field validation function
    function validateContactField(field) {
        const value = field.value.trim();
        const fieldName = field.previousElementSibling ? field.previousElementSibling.textContent : 'This field';
        
        // Remove any existing error styling
        field.classList.remove('error');
        
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
        
        // Phone validation (basic)
        if (field.type === 'tel' && value !== '') {
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                field.classList.add('error');
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        // Remove any error message
        removeFieldError(field);
        return true;
    }

    // Show field error message
    function showFieldError(field, message) {
        removeFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '0.5rem';
        
        field.parentNode.appendChild(errorElement);
    }

    // Remove field error message
    function removeFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Show form success message
    function showFormSuccess() {
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center;">
                <h4 style="margin: 0 0 0.5rem 0; color: #155724;">✅ Message Sent Successfully!</h4>
                <p style="margin: 0;">Thank you for contacting us! We'll get back to you within 24 hours.</p>
            </div>
        `;
        
        // Insert before the form
        contactForm.parentNode.insertBefore(successMessage, contactForm);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add CSS for error state
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #e74c3c;
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
        }
    `;
    document.head.appendChild(style);
});