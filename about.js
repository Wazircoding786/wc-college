// ========== ABOUT PAGE SPECIFIC FUNCTIONALITY ==========
function initAboutPage() {
    // Check if we're on the about page
    if (!document.querySelector('.all-container')) return;
    
    // Add animation to mentor cards
    const mentorCards = document.querySelectorAll('.ourmentor');
    mentorCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(' + (index % 2 === 0 ? '-' : '') + '50px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Observe mentor cards for animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(card);
    });
    
    // Add click to expand for mission/vision items
    const missionVisionItems = document.querySelectorAll('.mission-vision-item');
    missionVisionItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
    
    // Director image hover effect
    const directorImage = document.querySelector('.director-image img');
    if (directorImage) {
        directorImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
        });
        
        directorImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        });
    }
}

// Call the about page initialization
document.addEventListener('DOMContentLoaded', function() {
    initAboutPage();
});