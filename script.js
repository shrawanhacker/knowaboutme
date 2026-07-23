document.addEventListener('DOMContentLoaded', () => {

    // Initialize EmailJS (Replace PUBLIC_KEY with your EmailJS key)
    if (typeof emailjs !== 'undefined') {
        emailjs.init("YOUR_PUBLIC_KEY"); 
    }

    // 18. Preloader Logic
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) preloader.classList.add('hidden');
        }, 600);
    });

    // 19. Cursor Glow (Disabled on Touch Devices)
    const cursorGlow = document.getElementById('cursorGlow');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice && cursorGlow) {
        cursorGlow.style.display = 'none';
    } else if (cursorGlow) {
        window.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    }

    // 14. Dark / Light Theme Switcher with localStorage
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';

    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    // Typing Effect
    const typedTextSpan = document.getElementById('typedText');
    const roles = [
        "Cloud Infrastructure Engineer",
        "Microsoft Azure Administrator",
        "Identity & Access Engineer",
        "Endpoint Management Specialist",
        "Enterprise Systems Analyst"
    ];
    let roleIdx = 0, charIdx = 0, isDeleting = false;

    function typeEffect() {
        if (!typedTextSpan) return;
        const currentRole = roles[roleIdx];
        
        typedTextSpan.textContent = isDeleting 
            ? currentRole.substring(0, charIdx - 1) 
            : currentRole.substring(0, charIdx + 1);

        charIdx += isDeleting ? -1 : 1;
        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentRole.length) {
            speed = 2200; isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            speed = 400;
        }
        setTimeout(typeEffect, speed);
    }
    typeEffect();

    // 12. Optimized Interactive Particles Canvas (Mobile Reduction)
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 120, 212, 0.4)';
                ctx.fill();
            }
        }

        // Reduce particle count on mobile for higher FPS
        const particleCount = window.innerWidth < 768 ? 25 : 65;
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, idx) => {
                p.update(); p.draw();
                for (let j = idx + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(0, 120, 212, ${0.15 - dist / 800})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // 7. Scroll Reveal & Active ScrollSpy Navigation Observer
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // 8. Trigger Skill Progress Bars & Percentage Counter
                if (entry.target.classList.contains('skill-category')) {
                    const fills = entry.target.querySelectorAll('.progress-fill');
                    const percents = entry.target.querySelectorAll('.bar-percent');
                    
                    fills.forEach(fill => {
                        fill.style.width = fill.getAttribute('data-progress');
                    });
                    percents.forEach(percent => {
                        const targetVal = +percent.getAttribute('data-target');
                        let count = 0;
                        const interval = setInterval(() => {
                            if (count < targetVal) {
                                count++;
                                percent.textContent = `${count}%`;
                            } else {
                                clearInterval(interval);
                            }
                        }, 15);
                    });
                }
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => scrollObserver.observe(el));

    // ScrollSpy Active Link Tracking
    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        // 20. Back To Top Visibility
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.scrollY > 400) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        }
    });

    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Stats Counter Observer
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                statNumbers.forEach(stat => {
                    const target = +stat.getAttribute('data-target');
                    let count = 0;
                    const speed = target / 40;
                    const updateCount = () => {
                        count += speed;
                        if (count < target) {
                            stat.innerText = Math.ceil(count);
                            setTimeout(updateCount, 30);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    updateCount();
                });
                counted = true;
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stats');
    if (statsSection) statsObserver.observe(statsSection);

    // 4. Contact Form Integration (EmailJS with fallback)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

            // If EmailJS keys are configured
            if (typeof emailjs !== 'undefined' && emailjs.sendForm) {
                // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual EmailJS parameters
                emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
                    .then(() => {
                        formStatus.className = 'form-status-msg success';
                        formStatus.textContent = 'Message sent successfully! I will get back to you shortly.';
                        contactForm.reset();
                    }, (err) => {
                        formStatus.className = 'form-status-msg error';
                        formStatus.textContent = 'Failed to send message via EmailJS. Please email me directly.';
                        console.error('EmailJS Error:', err);
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Message`;
                    });
            } else {
                // Fallback simulation
                setTimeout(() => {
                    formStatus.className = 'form-status-msg success';
                    formStatus.textContent = 'Thank you! Your message has been recorded.';
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Message`;
                }, 1000);
            }
        });
    }

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => mobileMenu.classList.toggle('active'));
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.remove('active'));
        });
    }

    // Dynamic Year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
