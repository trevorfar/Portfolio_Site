document.addEventListener('scroll', function() {
    const parallaxSection = document.querySelector('.parallax-section');
    const scrolled = window.scrollY;
    parallaxSection.style.transform = `translateY(${scrolled * 0.5}px)`; // Adjust the multiplier for different speed
});