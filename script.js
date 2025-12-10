// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// YouTube Video Preview Functionality
function initYouTubePreviews() {
    // Extract YouTube video ID from URL
    function getYouTubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Create YouTube thumbnail background
    function createYouTubeBackground(projectImage, videoId) {
        const background = document.createElement('div');
        background.className = 'youtube-background';
        background.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;
        projectImage.appendChild(background);

        // Create play overlay
        const playOverlay = document.createElement('div');
        playOverlay.className = 'play-overlay';
        playOverlay.innerHTML = '<i class="fas fa-play"></i>';
        projectImage.appendChild(playOverlay);

        // Create preview container
        const preview = document.createElement('div');
        preview.className = 'youtube-preview';
        projectImage.appendChild(preview);

        // Add click event to play overlay
        playOverlay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Create YouTube embed iframe
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;

            preview.appendChild(iframe);
            playOverlay.style.display = 'none';
        });

        // Reset on mouse leave
        projectImage.closest('.project-card').addEventListener('mouseleave', () => {
            preview.innerHTML = '';
            playOverlay.style.display = 'flex';
        });
    }

    // Find all project cards with YouTube links
    document.querySelectorAll('.project-card').forEach(card => {
        const youtubeLink = card.querySelector('a[href*="youtu"]');
        if (youtubeLink) {
            const videoId = getYouTubeVideoId(youtubeLink.href);
            if (videoId) {
                const projectImage = card.querySelector('.project-image');
                createYouTubeBackground(projectImage, videoId);
            }
        }
    });
}

function initGameCovers() {
    const cards = document.querySelectorAll('.game-card');

    cards.forEach(card => {
        if (card.classList.contains('has-cover')) return;

        const link = card.querySelector('.game-link');
        const title = card.querySelector('.game-header h3')?.textContent?.trim() || 'Game';

        if (!link) return;

        const href = link.getAttribute('href') || '';
        const codeMatch = href.match(/\/([^\/?#]+)(?:\?.*)?$/);
        if (!codeMatch) return;

        const code = codeMatch[1];
        const coverUrl = `https://static.gamezop.com/${code}/cover.jpg`;

        // Preserve existing content inside a wrapper to keep stacking order clean
        const content = document.createElement('div');
        content.className = 'game-card-content';
        while (card.firstChild) {
            content.appendChild(card.firstChild);
        }

        // Create a gradient background based on title hash for fallback
        const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const colors = [
            'linear-gradient(135deg, rgba(0, 191, 255, 0.2), rgba(0, 130, 255, 0.15))',
            'linear-gradient(135deg, rgba(255, 94, 188, 0.2), rgba(200, 100, 255, 0.15))',
            'linear-gradient(135deg, rgba(0, 255, 150, 0.2), rgba(0, 200, 100, 0.15))',
            'linear-gradient(135deg, rgba(255, 200, 0, 0.2), rgba(255, 140, 0, 0.15))',
            'linear-gradient(135deg, rgba(100, 200, 255, 0.2), rgba(50, 150, 255, 0.15))'
        ];

        const fallbackGradient = colors[Math.abs(hash) % colors.length];

        // Add cover with image that falls back to gradient
        const cover = document.createElement('div');
        cover.className = 'game-cover game-cover-placeholder';
        cover.style.background = fallbackGradient;

        // Try to load actual image
        const img = document.createElement('img');
        img.src = coverUrl;
        img.alt = `${title} cover`;
        img.loading = 'lazy';
        img.className = 'game-cover-img';

        // If image loads successfully, remove gradient
        img.onload = function () {
            cover.style.background = 'none';
        };

        // If image fails (ad blocker, CORS, etc), keep gradient
        img.onerror = function () {
            img.style.display = 'none';
            cover.style.background = fallbackGradient;
        };

        cover.appendChild(img);
        content.insertBefore(cover, content.firstChild);

        // Rebuild card with content
        card.appendChild(content);
        card.classList.add('has-cover');
    });
}

// Smooth scrolling for navigation links
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

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections for fade-in animation
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Animate skill bars when they come into view
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBar = entry.target;
            const width = skillBar.getAttribute('data-width');
            setTimeout(() => {
                skillBar.style.width = width;
            }, 500);
            skillObserver.unobserve(skillBar);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Floating elements animation
const floatingElements = document.querySelectorAll('.floating-element');
floatingElements.forEach((element, index) => {
    const speed = element.getAttribute('data-speed') || 1;
    element.style.animationDuration = `${6 / speed}s`;
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');

    parallaxElements.forEach((element, index) => {
        const speed = element.getAttribute('data-speed') || 1;
        const yPos = -(scrolled * speed * 0.1);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize interactive elements on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    try {
        initYouTubePreviews();
    } catch (e) {
        console.error('YouTube previews failed:', e);
    }

    try {
        initGameCovers();
    } catch (e) {
        console.error('Game covers failed:', e);
    }

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            try {
                typeWriter(heroTitle, originalText, 50);
            } catch (e) {
                console.error('TypeWriter failed:', e);
            }
        }, 500);
    }
});

// Add glow effect to cards on hover
const cards = document.querySelectorAll('.project-card, .skill-category');
cards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.3)';
        this.style.transform = 'translateY(-5px)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.boxShadow = '';
        this.style.transform = '';
    });
});

// Cursor trail effect
const cursor = document.createElement('div');
cursor.className = 'cursor-trail';
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transition: transform 0.1s ease-out;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
});

// Hide cursor trail on touch devices
if ('ontouchstart' in window) {
    cursor.style.display = 'none';
}

// Preloader
const preloader = document.createElement('div');
preloader.className = 'preloader';
preloader.innerHTML = `
    <div class="loader">
        <div class="loader-inner">
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
            <div class="loader-line-wrap">
                <div class="loader-line"></div>
            </div>
        </div>
    </div>
`;

const preloaderStyles = `
    <style>
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0a0a0a;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease-out;
        }
        
        .loader {
            width: 60px;
            height: 60px;
            position: relative;
        }
        
        .loader-inner {
            width: 100%;
            height: 100%;
            position: relative;
        }
        
        .loader-line-wrap {
            animation: spin 2s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
            box-sizing: border-box;
            height: 50px;
            left: 50%;
            overflow: hidden;
            position: absolute;
            top: 50%;
            transform-origin: 50% 50%;
            width: 50px;
            z-index: 1;
        }
        
        .loader-line {
            border: 2px solid transparent;
            border-radius: 100%;
            box-sizing: border-box;
            height: 100%;
            left: 0;
            margin: 0 auto;
            position: absolute;
            right: 0;
            top: 0;
            width: 100%;
        }
        
        .loader-line-wrap:nth-child(1) { animation-delay: -50ms; }
        .loader-line-wrap:nth-child(2) { animation-delay: -100ms; }
        .loader-line-wrap:nth-child(3) { animation-delay: -150ms; }
        .loader-line-wrap:nth-child(4) { animation-delay: -200ms; }
        .loader-line-wrap:nth-child(5) { animation-delay: -250ms; }
        
        .loader-line-wrap:nth-child(1) .loader-line { border-color: #00d4ff; }
        .loader-line-wrap:nth-child(2) .loader-line { border-color: #ff006e; }
        .loader-line-wrap:nth-child(3) .loader-line { border-color: #8338ec; }
        .loader-line-wrap:nth-child(4) .loader-line { border-color: #00d4ff; }
        .loader-line-wrap:nth-child(5) .loader-line { border-color: #ff006e; }
        
        @keyframes spin {
            0%, 15% { transform: translate(-50%, -50%) rotate(0); }
            25%, 35% { transform: translate(-50%, -50%) rotate(90deg); }
            45%, 55% { transform: translate(-50%, -50%) rotate(180deg); }
            65%, 75% { transform: translate(-50%, -50%) rotate(270deg); }
            85%, 100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', preloaderStyles);
document.body.appendChild(preloader);

// Hide preloader after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }, 1000);
});

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #00d4ff, #ff006e);
    z-index: 9999;
    transition: width 0.3s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// Add particle effect to hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(0, 212, 255, 0.5);
            border-radius: 50%;
            animation: float-particle ${Math.random() * 3 + 2}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        particlesContainer.appendChild(particle);
    }

    hero.appendChild(particlesContainer);
}

// Add particle animation styles
const particleStyles = `
    <style>
        @keyframes float-particle {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
                opacity: 0.5;
            }
        }
    </style>
`;
document.head.insertAdjacentHTML('beforeend', particleStyles);

// Initialize particles
createParticles();

// Easter egg - Konami code
let konamiCode = [];
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konami.length) {
        konamiCode.shift();
    }

    if (konamiCode.join(',') === konami.join(',')) {
        // Easter egg activated
        document.body.style.animation = 'rainbow 2s ease-in-out infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
    }
});

// Add rainbow animation for easter egg
const rainbowStyles = `
    <style>
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    </style>
`;
document.head.insertAdjacentHTML('beforeend', rainbowStyles);

// Flying Unicorn with Sparkle Trail
function createSparkleTrail() {
    const unicorn = document.getElementById('unicorn');
    if (!unicorn) return;

    // Bright white and pink colors only
    const brightColors = [
        '#ffffff',  // Pure white
        '#ffccdd',  // Light pink
        '#ff99cc',  // Bright pink
        '#ffddee',  // Very light pink
        '#ff66bb',  // Hot pink
        '#ffe6f0',  // Pale pink
        '#ff80cc',  // Medium pink
        '#fff0f5',  // Lavender blush white
        '#ff4da6',  // Vibrant pink
        '#ffb3d9',  // Soft pink
        '#ffeef7',  // Almost white pink
        '#ff1a8c'   // Electric pink
    ];

    const sparkle = document.createElement('div');
    sparkle.className = 'trail-square';
    sparkle.style.position = 'fixed';
    sparkle.style.width = '12px';
    sparkle.style.height = '12px';

    const color = brightColors[Math.floor(Math.random() * brightColors.length)];

    sparkle.style.background = color;
    sparkle.style.borderRadius = '2px'; // Slightly rounded squares
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9998';
    sparkle.style.animation = 'sparkle-fade 2s ease-out forwards';
    sparkle.style.boxShadow = `0 0 25px ${color}, 0 0 50px ${color}, 0 0 75px ${color}`;
    sparkle.style.color = color;

    // Position sparkle at unicorn's current position with more spread
    const unicornRect = unicorn.getBoundingClientRect();
    sparkle.style.left = (unicornRect.left + unicornRect.width / 2 - 60 + Math.random() * 120 - 60) + 'px';
    sparkle.style.top = (unicornRect.top + unicornRect.height / 2 + Math.random() * 40 - 20) + 'px';

    document.body.appendChild(sparkle);

    // Remove sparkle after animation
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 2000);
}

// Start sparkle trail when unicorn starts flying
setInterval(createSparkleTrail, 100);

// Make unicorn disappear when clicked
document.addEventListener('DOMContentLoaded', function () {
    const unicorn = document.getElementById('unicorn');
    if (unicorn) {
        unicorn.addEventListener('click', function () {
            unicorn.style.opacity = '0';
            unicorn.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                unicorn.style.display = 'none';
            }, 500);
        });

        // Make unicorn clickable
        unicorn.style.cursor = 'pointer';
        unicorn.style.pointerEvents = 'all';
    }
});

// Add some magical sound effect on click (optional easter egg)
document.addEventListener('click', function (e) {
    const unicorn = document.getElementById('unicorn');
    if (unicorn && Math.random() < 0.15) { // 15% chance
        // Create extra magical rainbow sparkle burst on click
        for (let i = 0; i < 8; i++) {
            setTimeout(() => createSparkleTrail(), i * 30);
        }
    }
});
