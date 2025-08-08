// CTA Button Handler
document.getElementById('ctaBtn')?.addEventListener('click', () => {
    alert('Welcome to Brand-loop! 🚀\n\nReady to transform your content creation process?');
});

// Demo Button Handler
document.querySelector('.demo-btn')?.addEventListener('click', () => {
    alert('🎬 Demo Coming Soon!\n\nOur interactive demo will show you how Brand-loop creates amazing content in seconds.');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('.nav a[href^="#"]').forEach(anchor => {
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
  