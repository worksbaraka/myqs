document.addEventListener('DOMContentLoaded', function() {
    // Loader timeout
    setTimeout(function() {
        document.querySelector('.loader').style.display = 'none';
    }, 1000);

    // Scroll to top
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (scrollBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('active');
            } else {
                scrollBtn.classList.remove('active');
            }
        });

        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Expertise items animation
    const expertiseItems = document.querySelectorAll('.expertise-item');
    function checkInView() {
        expertiseItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
            if (rect.top <= viewHeight * 0.75 && rect.bottom >= 0) {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }

    // Initial animation state
    expertiseItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
    });

    window.addEventListener('scroll', checkInView);
    checkInView();

    // Form submission
    const form = document.getElementById('waitlist-form');
    const toast = document.querySelector('.toast-notification');

    if (form && toast) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = form.querySelector('.btn');
            
            try {
                const response = await fetch('https://formspree.io/f/mjkwlpwr', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: document.getElementById('name').value.trim(),
                        email: document.getElementById('email').value.trim(),
                        company: document.getElementById('company').value.trim()
                    })
                });

                if (!response.ok) throw new Error(response.statusText);

                // Success handling
                toast.classList.add('active');
                form.reset();
                btn.innerHTML = '<i class="fas fa-check"></i> Success!';
                btn.style.backgroundColor = 'var(--success)';

                setTimeout(() => {
                    toast.classList.remove('active');
                    btn.innerHTML = '<span>Join Waiting List</span><i class="fas fa-arrow-right ml-2"></i>';
                    btn.style.backgroundColor = '';
                }, 2000);

            } catch (err) {
                console.error('Submission error:', err);
                alert('Oops! Something went wrong — please try again.');
            }
        });
    }

    // Hover effect
    expertiseItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Hero animations
    const heroTitle = document.querySelector('.hero h1');
    const heroText = document.querySelector('.hero p');
    if (heroTitle && heroText) {
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
        setTimeout(() => {
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 500);
    }
});