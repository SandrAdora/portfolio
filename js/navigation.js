const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// Tap-to-flip for certificate cards on touch devices
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 768px)').matches) {
            card.classList.toggle('is-flipped');
        }
    });
});
