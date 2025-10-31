// The Body Shop Renewal - Main JavaScript

// Header Hide/Show on Scroll
let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('hide');
        return;
    }
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        header.classList.add('hide');
    } else {
        // Scrolling up
        header.classList.remove('hide');
    }
    
    lastScroll = currentScroll;
});

// Slider Functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (index >= slides.length) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = slides.length - 1;
    
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
}

// Auto-advance slides (only if slides exist)
if (slides.length > 0) {
    setInterval(() => {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    }, 5000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') !== '#') {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Active menu highlighting
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.style.color = 'var(--primary-green)';
    }
});
