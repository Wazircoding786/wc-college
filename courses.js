// ========== COURSES PAGE SPECIFIC FUNCTIONALITY ==========
function initCoursesPage() {
    // Check if we're on the courses page
    if (!document.querySelector('.category-filters')) return;

    // Course Filtering Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCategories = document.querySelectorAll('.course-category');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            courseCategories.forEach(category => {
                if (filter === 'all' || category.getAttribute('data-category') === filter) {
                    category.style.display = 'block';
                    // Add fade in animation
                    category.style.animation = 'fadeInUp 0.6s ease';
                } else {
                    category.style.display = 'none';
                }
            });

            // Track user action for analytics
            trackUserAction('course_filter', { filter: filter });
        });
    });

    // Enhanced Course Card Interactions
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
            
            // Scale image slightly on hover
            const image = this.querySelector('.course-image img');
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            
            // Reset image scale
            const image = this.querySelector('.course-image img');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });

        // Add click animation
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on enroll button
            if (e.target.classList.contains('enroll-btn')) return;
            
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        // Price animation
        const priceElement = card.querySelector('.course-price');
        if (priceElement) {
            priceElement.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.color = 'var(--accent-color)';
            });
            
            priceElement.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.color = '';
            });
        }
    });

    // Enroll button interactions
    const enrollButtons = document.querySelectorAll('.enroll-btn');
    
    enrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const courseTitle = this.closest('.course-card').querySelector('h4').textContent;
            const coursePrice = this.closest('.course-card').querySelector('.course-price').textContent;
            
            // Show enrollment confirmation
            showEnrollmentModal(courseTitle, coursePrice, this.href);
            
            // Track enrollment attempt
            trackUserAction('enroll_click', { 
                course: courseTitle, 
                price: coursePrice 
            });
        });
    });

    // Benefits grid animations
    const benefitItems = document.querySelectorAll('.benefit-item');
    
    benefitItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(item);
    });

    // CTA button animations
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Course image lazy loading and hover effects
    const courseImages = document.querySelectorAll('.course-image img');
    
    courseImages.forEach(img => {
        // Add transition for smooth scaling
        img.style.transition = 'transform 0.3s ease';
        
        // Lazy loading
        if (img.getAttribute('data-src')) {
            img.src = img.getAttribute('data-src');
        }
    });

    // URL parameter handling for direct category access
    function handleUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category && document.querySelector(`[data-filter="${category}"]`)) {
            // Trigger click on the corresponding filter button
            document.querySelector(`[data-filter="${category}"]`).click();
            
            // Scroll to categories section
            setTimeout(() => {
                document.getElementById('course-categories').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }, 100);
        }
    }

    handleUrlParameters();

    // Keyboard navigation for filters
    document.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            const currentIndex = Array.from(filterButtons).indexOf(e.target);
            
            if (e.key === 'ArrowRight' && currentIndex < filterButtons.length - 1) {
                filterButtons[currentIndex + 1].focus();
                filterButtons[currentIndex + 1].click();
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                filterButtons[currentIndex - 1].focus();
                filterButtons[currentIndex - 1].click();
            }
        }
    });

    // Add animation for course categories when they come into view
    const courseCategorySections = document.querySelectorAll('.course-category');
    
    courseCategorySections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(section);
    });

    console.log('Courses page initialized with enhanced functionality!');
}

// Enrollment Modal Function
function showEnrollmentModal(courseTitle, coursePrice, enrollUrl) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.enrollment-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'enrollment-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h3>Enroll in ${courseTitle}</h3>
            <div class="modal-body">
                <p class="course-price">Price: <strong>${coursePrice}</strong></p>
                <p>You're about to enroll in this course. You'll be redirected to the enrollment page to complete your registration.</p>
                <div class="modal-actions">
                    <button class="btn-secondary">Cancel</button>
                    <a href="${enrollUrl}" class="btn-primary">Proceed to Enrollment</a>
                </div>
            </div>
        </div>
    `;

    // Add styles for modal
    const modalStyles = `
        .enrollment-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        .modal-content {
            position: relative;
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease;
        }
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--secondary-color);
        }
        .modal-close:hover {
            color: var(--primary-color);
        }
        .modal-body {
            margin: 1.5rem 0;
        }
        .course-price {
            font-size: 1.2rem;
            color: var(--accent-color);
            margin-bottom: 1rem;
        }
        .modal-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        .modal-actions .btn-primary,
        .modal-actions .btn-secondary {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            text-decoration: none;
            text-align: center;
            flex: 1;
        }
        .modal-actions .btn-primary {
            background: var(--accent-color);
            color: var(--primary-color);
        }
        .modal-actions .btn-secondary {
            background: #f8f9fa;
            color: var(--secondary-color);
            border: 1px solid #e0e0e0;
        }
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;

    // Add styles to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);

    // Add modal to page
    document.body.appendChild(modal);

    // Modal event listeners
    modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.remove();
        styleSheet.remove();
    });

    modal.querySelector('.modal-overlay').addEventListener('click', function() {
        modal.remove();
        styleSheet.remove();
    });

    modal.querySelector('.btn-secondary').addEventListener('click', function() {
        modal.remove();
        styleSheet.remove();
    });

    // Close modal with Escape key
    const closeModal = function(e) {
        if (e.key === 'Escape') {
            modal.remove();
            styleSheet.remove();
            document.removeEventListener('keydown', closeModal);
        }
    };
    document.addEventListener('keydown', closeModal);
}

// Initialize courses page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCoursesPage();
});