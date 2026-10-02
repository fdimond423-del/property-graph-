document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            navbar.classList.toggle('active');
            const icon = menuIcon.querySelector('i');
            if (icon) {
                if (navbar.classList.contains('active')) {
                    icon.classList.replace('bx-menu', 'bx-x');
                } else {
                    icon.classList.replace('bx-x', 'bx-menu');
                }
            }
        });
    }

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar) navbar.classList.remove('active');
            if (menuIcon) {
                const icon = menuIcon.querySelector('i');
                if (icon) icon.classList.replace('bx-x', 'bx-menu');
            }
        });
    });

    // Header scroll effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            }
        }, { passive: true });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                // Close other open items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAns = otherItem.querySelector('.faq-answer');
                        if (otherAns) otherAns.style.maxHeight = null;
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    if (item.classList.contains('active')) {
                        answer.style.maxHeight = answer.scrollHeight + "px";
                    } else {
                        answer.style.maxHeight = null;
                    }
                }
            });
        }
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-down, .zoom-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // ==========================================
    // HIGH-PERFORMANCE VIDEO LAZY LOADING
    // Prevents browser from buffering 14 videos simultaneously (saves ~30MB bandwidth)
    // ==========================================
    const videoElements = document.querySelectorAll('.video-card video');
    videoElements.forEach(vid => {
        vid.preload = 'none';
        vid.setAttribute('playsinline', '');
    });

    if ('IntersectionObserver' in window && videoElements.length > 0) {
        const videoObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const vid = entry.target;
                    // When scrolled within 250px of the video, enable metadata so it's ready to play
                    vid.preload = 'metadata';
                    obs.unobserve(vid);
                }
            });
        }, { rootMargin: '250px 0px' });

        videoElements.forEach(vid => videoObserver.observe(vid));
    }

    // ==========================================
    // FORM SUBMISSION TO HIDDEN IFRAME
    // Forms now use target="hidden_iframe" to submit without leaving the page.
    // The hidden iframe's onload event handles the redirect to thankyou.html.
    // ==========================================
    const forms = document.querySelectorAll('form[action*="formsubmit.co"], #leadForm, #popupForm, #contactForm');
    forms.forEach(form => {
        form.addEventListener('submit', () => {
            const formData = new FormData(form);
            try {
                sessionStorage.setItem('pg_lead_name', formData.get('name') || '');
                sessionStorage.setItem('pg_lead_phone', formData.get('phone') || '');
                sessionStorage.setItem('pg_lead_email', formData.get('email') || '');
                sessionStorage.setItem('pg_lead_purpose', formData.get('purpose') || formData.get('message') || '');
                sessionStorage.setItem('pg_submitted', 'true');
            } catch (err) {}
            
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                setTimeout(() => {
                    btn.disabled = true;
                    btn.innerHTML = "<i class='bx bx-loader-alt bx-spin' style='vertical-align: middle;'></i> Submitting...";
                }, 50);
            }
            window.submitted = true;
        });
    });

    // ==========================================
    // AUTO POPUP FORM LOGIC
    // ==========================================
    const popup = document.getElementById('autoPopup');
    const closePopup = document.getElementById('closePopup');

    function showPopup() {
        // Do not display if already submitted
        try {
            if (sessionStorage.getItem('pg_submitted') === 'true') {
                return;
            }
        } catch (e) {}

        if (popup && !popup.classList.contains('active')) {
            popup.classList.add('active');
        }
    }

    if (closePopup && popup) {
        closePopup.addEventListener('click', () => {
            popup.classList.remove('active');
        });
    }

    // Close when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
        }
    });

    // Show popup ONCE when opening website (after 3.5 seconds)
    setTimeout(showPopup, 3500);
});

