// DeepMine AI - Interactive JavaScript

// ================================
// Smooth Scrolling
// ================================
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 80; // Account for fixed navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ================================
// Profit Calculator
// ================================
function updateCalculator() {
    const investment = parseFloat(document.getElementById('investmentAmount').value) || 0;
    const rate = parseFloat(document.getElementById('returnRate').value) || 0;
    const duration = parseInt(document.getElementById('duration').value) || 0;

    const dailyProfit = investment * (rate / 100);
    const totalProfit = dailyProfit * duration;

    document.getElementById('dailyProfit').textContent = `$${dailyProfit.toFixed(2)}`;
    document.getElementById('totalProfit').textContent = `$${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ================================
// Referral Calculator
// ================================
function updateReferralCalculator() {
    const directRefs = parseInt(document.getElementById('directRefs').value) || 0;
    const indirectRefs = parseInt(document.getElementById('indirectRefs').value) || 0;

    const directBonus = directRefs * 80;
    const indirectBonus = indirectRefs * 15;
    const total = directBonus + indirectBonus;

    document.getElementById('refTotal').textContent = `$${total.toLocaleString('en-US')}`;
}

// ================================
// Floating CTA Visibility
// ================================
function handleFloatingCTA() {
    const floatingCta = document.getElementById('floatingCta');
    const heroSection = document.getElementById('hero');
    const footer = document.querySelector('.footer');
    
    if (!floatingCta || !heroSection || !footer) return;

    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const scrollPosition = window.pageYOffset + window.innerHeight;
    
    // Get footer position relative to viewport
    const footerRect = footer.getBoundingClientRect();
    const footerVisible = footerRect.top < window.innerHeight - 50; // 50px threshold

    // Show button after hero, but hide when footer is visible in viewport
    if (scrollPosition > heroBottom + 200 && !footerVisible) {
        floatingCta.classList.add('visible');
        floatingCta.classList.remove('hide-on-footer');
    } else if (footerVisible) {
        floatingCta.classList.remove('visible');
        floatingCta.classList.add('hide-on-footer');
    } else {
        floatingCta.classList.remove('visible');
        floatingCta.classList.remove('hide-on-footer');
    }
}

// ================================
// Particle Animation
// ================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(${Math.random() > 0.5 ? '41, 121, 255' : '51, 240, 255'}, ${Math.random() * 0.5 + 0.2})`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.boxShadow = `0 0 ${Math.random() * 20 + 10}px rgba(51, 240, 255, 0.5)`;
        
        particlesContainer.appendChild(particle);
    }
}

// ================================
// Mobile Menu Toggle
// ================================
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// ================================
// Contact Form Handler (Web3Forms)
// ================================
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formResult = document.getElementById('formResult');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            
            formResult.innerHTML = "Sending...";
            formResult.style.color = "var(--aqua-glow)";
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });
                
                const result = await response.json();
                
                if (response.status === 200) {
                    formResult.innerHTML = "✓ Message sent successfully! We'll get back to you soon.";
                    formResult.style.color = "var(--aqua-glow)";
                    contactForm.reset();
                    
                    setTimeout(() => {
                        formResult.innerHTML = "";
                    }, 5000);
                } else {
                    formResult.innerHTML = result.message || "Something went wrong. Please try again.";
                    formResult.style.color = "#ff6b6b";
                }
            } catch (error) {
                formResult.innerHTML = "Error sending message. Please try again or email us directly.";
                formResult.style.color = "#ff6b6b";
            }
        });
    }
}

// ================================
// Navbar Scroll Effect
// ================================
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(11, 15, 30, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(11, 15, 30, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

// ================================
// Intersection Observer for Animations
// ================================
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll('.step-card, .ai-card, .model-card, .security-card, .stat-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ================================
// Number Counter Animation
// ================================
function animateNumber(element, target, duration = 2000) {
    if (!element) return;
    
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with commas
        if (element.id === 'refTotal') {
            element.textContent = `$${Math.floor(current).toLocaleString('en-US')}`;
        } else {
            element.textContent = `$${current.toFixed(2)}`;
        }
    }, 16);
}

// ================================
// Copy Code to Clipboard
// ================================
function setupCodeCopy() {
    const codeBadges = document.querySelectorAll('.code-badge, .code-highlight');
    
    codeBadges.forEach(badge => {
        badge.style.cursor = 'pointer';
        badge.title = 'Click to copy';
        
        badge.addEventListener('click', (e) => {
            e.preventDefault();
            const code = badge.textContent.trim();
            
            // Copy to clipboard
            if (navigator.clipboard) {
                navigator.clipboard.writeText(code).then(() => {
                    // Show feedback
                    const originalText = badge.textContent;
                    badge.textContent = 'Copied!';
                    setTimeout(() => {
                        badge.textContent = originalText;
                    }, 2000);
                });
            } else {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = code;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                
                const originalText = badge.textContent;
                badge.textContent = 'Copied!';
                setTimeout(() => {
                    badge.textContent = originalText;
                }, 2000);
            }
        });
    });
}

// ================================
// Mobile Menu Styles
// ================================
function addMobileMenuStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-links {
                position: fixed;
                top: 82px;
                left: 0;
                right: 0;
                background: rgba(11, 15, 30, 0.98);
                backdrop-filter: blur(20px);
                flex-direction: column;
                padding: 24px;
                gap: 16px;
                border-bottom: 1px solid rgba(41, 121, 255, 0.2);
                transform: translateY(-100%);
                opacity: 0;
                transition: all 0.3s ease;
                pointer-events: none;
            }
            
            .nav-links.active {
                transform: translateY(0);
                opacity: 1;
                pointer-events: auto;
            }
            
            .nav-links a {
                padding: 12px 0;
                text-align: center;
                font-size: 16px;
            }
        }
    `;
    document.head.appendChild(style);
}

// ================================
// Initialize Everything
// ================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DeepMine AI - Initializing...');

    // Setup calculators
    const investmentInput = document.getElementById('investmentAmount');
    const returnRateInput = document.getElementById('returnRate');
    const durationSelect = document.getElementById('duration');
    
    if (investmentInput && returnRateInput && durationSelect) {
        investmentInput.addEventListener('input', updateCalculator);
        returnRateInput.addEventListener('input', updateCalculator);
        durationSelect.addEventListener('change', updateCalculator);
        updateCalculator(); // Initial calculation
    }

    const directRefsInput = document.getElementById('directRefs');
    const indirectRefsInput = document.getElementById('indirectRefs');
    
    if (directRefsInput && indirectRefsInput) {
        directRefsInput.addEventListener('input', updateReferralCalculator);
        indirectRefsInput.addEventListener('input', updateReferralCalculator);
        updateReferralCalculator(); // Initial calculation
    }

    // Setup other features
    createParticles();
    setupMobileMenu();
    setupContactForm();
    setupScrollAnimations();
    setupCodeCopy();
    addMobileMenuStyles();

    // Scroll event listeners
    window.addEventListener('scroll', () => {
        handleFloatingCTA();
        handleNavbarScroll();
    });

    // Initial scroll checks
    handleFloatingCTA();
    handleNavbarScroll();

    console.log('DeepMine AI - Ready!');
});

// ================================
// Export functions for global access
// ================================
window.scrollToSection = scrollToSection;
