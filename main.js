console.log('Main JS loaded');

document.addEventListener('DOMContentLoaded', () => {
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

    // Parallax Effect for Hero
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg) {
        let lastScrollY = window.scrollY;
        let ticking = false;

        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Parallax: Move background at 40% of scroll speed
                    // Apply base scale of 1.0 (after cinemtaic zoom settles) or handle separately if zoom is CSS only. 
                    // Note: CSS animation might conflict with this transform if not careful. 
                    // To avoid conflict, we target the container .hero-bg or wrapping div if we want to separate transforms.
                    // But here we'll assume CSS zoom finishes or we just add the translation on top if the CSS uses a wrapper?
                    // Actually, the CSS animation targets the img. 
                    // Let's rely on CSS for the zoom, and JS for parallax on top.
                    // IMPORTANT: Setting style.transform in JS overrides CSS transform and animation!
                    // Fix: Apply parallax to the parent .hero-bg, keep img for zoom.
                });
                ticking = true;
            }
        });

        // Correct approach: Parallax on the container to avoid conflict with IMG zoom animation
        const heroBgContainer = document.querySelector('.hero-bg');
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

    // Reservation Form Handling
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulating form submission
            const btn = reservationForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Sending Request...';
            btn.disabled = true;

            setTimeout(() => {
                alert('This is a demo website. Form submissions are not active. \n\nIn a production environment, this would connect to a reservation system.');
                reservationForm.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1000);
        });
    }
});
