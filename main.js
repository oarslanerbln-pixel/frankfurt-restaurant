console.log('Main JS loaded');

// Google Analytics Event Tracking Helper
function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventParams);
        console.log('GA Event:', eventName, eventParams);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Custom Luxury Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    // Only enable on non-touch devices
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (!isTouchDevice && cursorDot && cursorRing) {
        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot follows immediately
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        // Ring follows with delay (smooth effect)
        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';

            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Detect hover over interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .menu-item, .gallery-item, input, textarea, .carousel-button, .lightbox-close, .back-to-top');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.classList.add('hover');
                cursorDot.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('hover');
                cursorDot.classList.remove('hover');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '1';
        });
    }

    // Time-Based Dynamic Greeting
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const hour = new Date().getHours();
        let greeting = "Contemporary European Cuisine in the Heart of Frankfurt";

        if (hour >= 6 && hour < 11) {
            greeting = "Start Your Day with Excellence";
        } else if (hour >= 11 && hour < 15) {
            greeting = "Experience Our Midday Creations";
        } else if (hour >= 15 && hour < 18) {
            greeting = "Teatime Sophistication Awaits";
        } else if (hour >= 18 || hour < 6) {
            greeting = "An Evening of Culinary Artistry";
        }

        heroSubtitle.textContent = greeting;
    }

    // Page Loader
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Allow body scroll after loader fades (optional, if you hid overflow)
        }, 1500);
    }

    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                entry.target.classList.add('scroll-reveal-active'); // Keep compatibility with existing class
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.scroll-reveal-left, .scroll-reveal-right, .fade-in-section, .stagger-container');
    revealElements.forEach(el => observer.observe(el));

    // Statistics Counter Animation
    let statsAnimated = false;
    const statsSection = document.querySelector('.stats-section');

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        });
    }

    // Parallax Effect for Hero
    const heroBgContainer = document.querySelector('.hero-bg');
    if (heroBgContainer) {
        window.addEventListener('scroll', () => {
            const scrollValue = window.scrollY;
            if (scrollValue < window.innerHeight) {
                window.requestAnimationFrame(() => {
                    heroBgContainer.style.transform = `translateY(${scrollValue * 0.4}px)`;
                });
            }
        });
    }

    // Carousel Logic
    const track = document.querySelector('.carousel-track');

    // Guard clause in case element doesn't exist
    if (!track) return;

    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button--right');
    const prevButton = document.querySelector('.carousel-button--left');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    const moveToSlide = (track, currentSlide, targetSlide) => {
        const targetIndex = slides.findIndex(slide => slide === targetSlide);
        track.style.transform = 'translateX(-' + (targetIndex * 100) + '%)';

        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    }

    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('current-slide');
        targetDot.classList.add('current-slide');
    }

    const updateArrows = (slides, prevButton, nextButton, targetIndex) => {
        if (targetIndex === 0) {
            prevButton.classList.add('is-hidden');
            nextButton.classList.remove('is-hidden');
        } else if (targetIndex === slides.length - 1) {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.add('is-hidden');
        } else {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.remove('is-hidden');
        }
    }

    // Click on left button
    prevButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const prevSlide = currentSlide.previousElementSibling;
        const currentDot = dotsNav.querySelector('.current-slide');
        const prevDot = currentDot.previousElementSibling;
        const prevIndex = slides.findIndex(slide => slide === prevSlide);

        moveToSlide(track, currentSlide, prevSlide);
        updateDots(currentDot, prevDot);
        updateArrows(slides, prevButton, nextButton, prevIndex);
    });

    // Click on right button
    nextButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling;
        const currentDot = dotsNav.querySelector('.current-slide');
        const nextDot = currentDot.nextElementSibling;
        const nextIndex = slides.findIndex(slide => slide === nextSlide);

        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
        updateArrows(slides, prevButton, nextButton, nextIndex);
    });

    // Click on dots
    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;

        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.current-slide');

        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];

        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
        updateArrows(slides, prevButton, nextButton, targetIndex);
    });

    // Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const currentSlide = track.querySelector('.current-slide');
        const currentIndex = slides.findIndex(slide => slide === currentSlide);

        if (touchEndX < touchStartX - 50) {
            // Swipe Left -> Next Slide
            if (currentIndex < slides.length - 1) {
                const nextSlide = slides[currentIndex + 1];
                const nextDot = dots[currentIndex + 1];
                const currentDot = dotsNav.querySelector('.current-slide');
                moveToSlide(track, currentSlide, nextSlide);
                updateDots(currentDot, nextDot);
            }
        }

        if (touchEndX > touchStartX + 50) {
            // Swipe Right -> Prev Slide
            if (currentIndex > 0) {
                const prevSlide = slides[currentIndex - 1];
                const prevDot = dots[currentIndex - 1];
                const currentDot = dotsNav.querySelector('.current-slide');
                moveToSlide(track, currentSlide, prevSlide);
                updateDots(currentDot, prevDot);
            }
        }
    }

    // Auto Play
    let autoPlayInterval;

    const startAutoPlay = () => {
        autoPlayInterval = setInterval(() => {
            const currentSlide = track.querySelector('.current-slide');
            const currentIndex = slides.findIndex(slide => slide === currentSlide);
            let nextIndex = currentIndex + 1;

            if (nextIndex >= slides.length) {
                nextIndex = 0; // Loop back to start
            }

            const nextSlide = slides[nextIndex];
            const nextDot = dots[nextIndex];
            const currentDot = dotsNav.querySelector('.current-slide');

            moveToSlide(track, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
            updateArrows(slides, prevButton, nextButton, nextIndex);
        }, 5000); // 5 seconds
    };

    const stopAutoPlay = () => {
        clearInterval(autoPlayInterval);
    };

    startAutoPlay();
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-overlay span').textContent;

            // Get higher res image if possible, here we just use the same source but without crop params if we had them separate
            // For now, using the same src
            const src = img.src.replace('&w=600', '&w=1200'); // Try to get higher res

            lightbox.style.display = "block";
            lightboxImg.src = src;
            lightboxCaption.innerHTML = caption;
            document.body.style.overflow = 'hidden'; // Disable scroll
        });
    });

    // Close Lightbox
    if (closeBtn) {
        closeBtn.onclick = function () {
            lightbox.style.display = "none";
            document.body.style.overflow = 'auto'; // Enable scroll
        }
    }

    // Close on outside click
    window.onclick = function (event) {
        if (event.target == lightbox) {
            lightbox.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    }

    // Header Scroll Effect
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll Progress Bar
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgressBar.style.width = scrolled + '%';
    });

    // Active Link Highlighting (ScrollSpy)
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // Mobile Menu
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links li');
    const mobileLinkAnchors = document.querySelectorAll('.mobile-nav-links a');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';

            // Stagger animations
            mobileLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    // Delay via transition-delay in CSS or just relying on the transition defined in CSS
                    link.style.transitionDelay = `${index * 0.1 + 0.2}s`;
                }
            });
        });

        // Close menu when a link is clicked
        mobileLinkAnchors.forEach(anchor => {
            anchor.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });


    }

    // Wine Pairing Section
    const courseButtons = document.querySelectorAll('.course-btn');
    const wineCategories = document.querySelectorAll('.wine-category');

    if (courseButtons.length > 0) {
        courseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedCourse = button.getAttribute('data-course');

                // Track wine pairing selection
                trackEvent('wine_pairing_selection', {
                    'course_type': selectedCourse,
                    'event_category': 'engagement',
                    'event_label': 'Wine Pairing Selector'
                });

                // Update button states
                courseButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update wine category display
                wineCategories.forEach(category => {
                    category.classList.remove('active');
                    if (category.getAttribute('data-category') === selectedCourse) {
                        // Small delay for smooth transition
                        setTimeout(() => {
                            category.classList.add('active');
                        }, 50);
                    }
                });
            });
        });
    }

    // Testimonials Carousel
    const testimonialsTrack = document.querySelector('.testimonials-track');

    if (testimonialsTrack) {
        const testimonialSlides = Array.from(testimonialsTrack.children);
        const testimonialDots = Array.from(document.querySelectorAll('.testimonial-dot'));
        let currentTestimonialIndex = 0;
        let testimonialAutoPlayInterval;

        const moveToTestimonial = (targetIndex) => {
            testimonialsTrack.style.transform = `translateX(-${targetIndex * 100}%)`;

            // Update active slide
            testimonialSlides.forEach(slide => slide.classList.remove('current-testimonial'));
            testimonialSlides[targetIndex].classList.add('current-testimonial');

            // Update active dot
            testimonialDots.forEach(dot => dot.classList.remove('current-testimonial'));
            testimonialDots[targetIndex].classList.add('current-testimonial');

            currentTestimonialIndex = targetIndex;
        };

        // Dot navigation
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                moveToTestimonial(index);
                stopTestimonialAutoPlay();
                startTestimonialAutoPlay();
            });
        });

        // Auto-play
        const startTestimonialAutoPlay = () => {
            testimonialAutoPlayInterval = setInterval(() => {
                let nextIndex = currentTestimonialIndex + 1;
                if (nextIndex >= testimonialSlides.length) {
                    nextIndex = 0;
                }
                moveToTestimonial(nextIndex);
            }, 6000); // 6 seconds
        };

        const stopTestimonialAutoPlay = () => {
            clearInterval(testimonialAutoPlayInterval);
        };

        // Start auto-play
        startTestimonialAutoPlay();

        // Pause on hover
        const testimonialContainer = document.querySelector('.testimonials-carousel-container');
        testimonialContainer.addEventListener('mouseenter', stopTestimonialAutoPlay);
        testimonialContainer.addEventListener('mouseleave', startTestimonialAutoPlay);
    }

    // Reservation Form Handling
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Track form submission
            trackEvent('reservation_attempt', {
                'event_category': 'conversion',
                'event_label': 'Reservation Form',
                'value': 1
            });

            const submitButton = reservationForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Sending Request...';
            submitButton.disabled = true;

            setTimeout(() => {
                alert('This is a demo website. Form submissions are not active. \n\nIn a production environment, this would connect to a reservation system.');
                reservationForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 3000);
        });
    }

    // Track Navigation Clicks
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            trackEvent('navigation_click', {
                'link_text': e.target.textContent.trim(),
                'event_category': 'navigation',
                'event_label': e.target.getAttribute('href')
            });
        });
    });

    // Track Phone/Email Clicks
    document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const type = link.href.startsWith('tel:') ? 'phone' : 'email';
            trackEvent('contact_click', {
                'contact_type': type,
                'event_category': 'conversion',
                'event_label': link.href
            });
        });
    });

    // Track Gallery Image Clicks
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            trackEvent('gallery_view', {
                'image_position': index + 1,
                'event_category': 'engagement',
                'event_label': 'Gallery Lightbox'
            });
        });
    });

    // Track Menu Carousel Navigation
    const menuCarouselButtons = document.querySelectorAll('.carousel-button');
    menuCarouselButtons.forEach(button => {
        button.addEventListener('click', () => {
            const direction = button.classList.contains('prev') ? 'previous' : 'next';
            trackEvent('carousel_navigation', {
                'direction': direction,
                'event_category': 'engagement',
                'event_label': 'Menu Carousel'
            });
        });
    });

    // Track Scroll Depth
    let scrollDepth = {
        25: false,
        50: false,
        75: false,
        100: false
    };

    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        Object.keys(scrollDepth).forEach(depth => {
            if (scrollPercent >= depth && !scrollDepth[depth]) {
                scrollDepth[depth] = true;
                trackEvent('scroll_depth', {
                    'percent_scrolled': depth,
                    'event_category': 'engagement',
                    'event_label': 'Page Scroll'
                });
            }
        });
    });

    // Track Sticky Book Now Button Clicks
    const stickyBookBtn = document.querySelector('.sticky-book-btn');
    if (stickyBookBtn) {
        stickyBookBtn.addEventListener('click', () => {
            trackEvent('sticky_cta_click', {
                'event_category': 'conversion',
                'event_label': 'Sticky Book Now Button',
                'value': 1
            });
        });
    }

    console.log('All scripts initialized with Google Analytics tracking');
});
