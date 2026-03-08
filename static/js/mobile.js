document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('mobile-nav');
  const overlay = document.getElementById('overlay');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');

  function updateScrollProgress() {
    if (!scrollProgress) {
      return;
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? (window.scrollY / max) * 100 : 0;
    scrollProgress.style.width = `${Math.max(0, Math.min(100, ratio))}%`;
  }

  function positionOverlayBelowNav() {
    if (!nav || !overlay) {
      return;
    }
    const navBottom = Math.max(0, Math.round(nav.getBoundingClientRect().bottom));
    overlay.style.top = `${navBottom}px`;
    overlay.style.height = `calc(100% - ${navBottom}px)`;
  }

  function closeMenu() {
    if (!nav || !overlay) {
      return;
    }
    nav.classList.remove('active');
    overlay.style.display = 'none';
  }

  if (menuBtn && nav && overlay) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
      if (nav.classList.contains('active')) {
        positionOverlayBelowNav();
        overlay.style.display = 'block';
      } else {
        overlay.style.display = 'none';
      }
    });

    overlay.addEventListener('click', closeMenu);
    nav.querySelectorAll('a, li').forEach((item) => item.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (nav.classList.contains('active')) {
        positionOverlayBelowNav();
      }
    });
    window.addEventListener('scroll', () => {
      if (nav.classList.contains('active')) {
        positionOverlayBelowNav();
      }
      updateScrollProgress();
    });
  }

  updateScrollProgress();
  window.addEventListener('resize', updateScrollProgress);

  function initBackToTop() {
    if (!backToTop) {
      return;
    }

    function updateButton() {
      const shouldShow = window.scrollY > 380;
      backToTop.classList.toggle('visible', shouldShow);
    }

    backToTop.addEventListener('click', () => {
      const welcome = document.getElementById('welcome');
      if (welcome) {
        welcome.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    updateButton();
    window.addEventListener('scroll', updateButton, { passive: true });
    window.addEventListener('resize', updateButton);
  }

  function initNavScrollSpy() {
    const navLinks = Array.from(document.querySelectorAll('#mobile-nav a[href^="#"]'));
    if (!navLinks.length) {
      return;
    }

    function updateActiveLink() {
      const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

      let bestSection = null;
      let bestDistance = Infinity;
      const anchorLine = window.innerHeight * 0.34;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - anchorLine);
        if (rect.bottom > 40 && distance < bestDistance) {
          bestDistance = distance;
          bestSection = section;
        }
      });

      navLinks.forEach((link) => {
        const targetId = link.getAttribute('href');
        const isActive = bestSection && targetId === `#${bestSection.id}`;
        link.classList.toggle('active', Boolean(isActive));
      });
    }

    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('resize', updateActiveLink);
  }

  function initDockedNavLogo() {
    const header = document.querySelector('header');
    const bar = document.querySelector('.bar');
    if (!header || !bar) {
      return;
    }

    function updateDockedState() {
      const headerBottom = header.getBoundingClientRect().bottom;
      const isDocked = headerBottom <= 0;
      document.body.classList.toggle('nav-docked', isDocked);
    }

    updateDockedState();
    window.addEventListener('scroll', updateDockedState, { passive: true });
    window.addEventListener('resize', updateDockedState);
  }

  initDockedNavLogo();

  function initSlider(sectionSelector) {
    const section = document.querySelector(sectionSelector);
    if (!section) {
      return;
    }

    const navButtons = section.querySelector('.nav-buttons');
    if (!navButtons) {
      return;
    }

    const host = navButtons.parentElement;
    if (!host) {
      return;
    }

    const slides = Array.from(host.querySelectorAll(':scope > .slide'));
    if (!slides.length) {
      return;
    }

    const isTabletRail =
      window.matchMedia && window.matchMedia('(min-width: 768px) and (max-width: 1439px)').matches;

    if (!isTabletRail) {
      let currentIndex = 0;

      function renderSingle() {
        slides.forEach((slide, idx) => {
          slide.style.display = idx === currentIndex ? 'block' : 'none';
        });
      }

      function nextSingle() {
        currentIndex = (currentIndex + 1) % slides.length;
        renderSingle();
      }

      function prevSingle() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        renderSingle();
      }

      const prevBtn = navButtons.querySelector('.prev-btn');
      const nextBtn = navButtons.querySelector('.next-btn');
      if (prevBtn) {
        prevBtn.addEventListener('click', prevSingle);
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', nextSingle);
      }

      renderSingle();
      return;
    }

    const track = document.createElement('div');
    track.className = 'slider-track';
    host.insertBefore(track, navButtons);
    slides.forEach((slide) => track.appendChild(slide));

    function getScrollStep() {
      // Scroll by almost one viewport of cards, similar to video rails.
      return Math.max(220, Math.round(track.clientWidth * 0.9));
    }

    function nextSlide() {
      track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    }

    function prevSlide() {
      track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    }

    function updateSliderState() {
      const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
      const atStart = track.scrollLeft <= 4;
      const atEnd = track.scrollLeft >= maxScrollLeft - 4;
      host.classList.toggle('at-start', atStart);
      host.classList.toggle('at-end', atEnd);
    }

    const prevBtn = navButtons.querySelector('.prev-btn');
    const nextBtn = navButtons.querySelector('.next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }

    track.addEventListener('scroll', updateSliderState, { passive: true });
    window.addEventListener('resize', updateSliderState);
    updateSliderState();
  }

  initSlider('.about');
  initSlider('.expertise');

  function initBeingQuestionRail() {
    const list = document.querySelector('.being-question-list');
    if (!list) {
      return;
    }

    const navButtons = list.querySelector('.nav-buttons');
    const rows = Array.from(list.querySelectorAll(':scope > .being-question-row'));
    if (!navButtons || !rows.length) {
      return;
    }

    const isRailView =
      window.matchMedia && window.matchMedia('(min-width: 768px) and (max-width: 1439px)').matches;

    if (!isRailView) {
      navButtons.style.display = 'none';
      return;
    }

    const track = document.createElement('div');
    track.className = 'being-track';
    list.insertBefore(track, navButtons);
    rows.forEach((row) => track.appendChild(row));

    function getScrollStep() {
      // Keep 2 cards + a visible hint of the next card.
      return Math.max(220, Math.round(track.clientWidth * 0.72));
    }

    function nextSlide() {
      track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    }

    function prevSlide() {
      track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    }

    function updateState() {
      const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
      const atStart = track.scrollLeft <= 4;
      const atEnd = track.scrollLeft >= maxScrollLeft - 4;
      list.classList.toggle('at-start', atStart);
      list.classList.toggle('at-end', atEnd);
    }

    const prevBtn = navButtons.querySelector('.prev-btn');
    const nextBtn = navButtons.querySelector('.next-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }

    track.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);
    updateState();
  }

  function initDummyRegisterRedirect() {
    const redirectForm = document.querySelector('.dummy-register-form');
    if (!redirectForm) {
      return;
    }

    const redirectUrl = redirectForm.dataset.redirectUrl || '/register';
    let redirected = false;

    function goToRegister(event) {
      if (event) {
        event.preventDefault();
      }
      if (redirected) {
        return;
      }
      redirected = true;
      window.location.href = redirectUrl;
    }

    redirectForm.addEventListener('submit', goToRegister);
    redirectForm.addEventListener('focusin', goToRegister);
    redirectForm.addEventListener('click', goToRegister);
  }

  initDummyRegisterRedirect();

  function initSmoothAnchors() {
    const links = Array.from(document.querySelectorAll('#mobile-nav a[href^="#"]'));
    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') {
          return;
        }
        const target = document.querySelector(targetId);
        if (!target) {
          return;
        }
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initSectionReveal() {
    const sections = Array.from(document.querySelectorAll('main section'));
    if (!sections.length) {
      return;
    }

    document.body.classList.add('has-motion');
    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    sections.forEach((section, idx) => {
      section.style.transitionDelay = `${Math.min(idx * 55, 220)}ms`;
      observer.observe(section);
    });
  }

  initSmoothAnchors();
  initSectionReveal();
  initBackToTop();
  initNavScrollSpy();

  function initParallaxSections() {
    const sections = Array.from(document.querySelectorAll('.about, .expertise, .grow, .being'));
    if (!sections.length) {
      return;
    }

    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.matchMedia && window.matchMedia('(max-width: 860px)').matches;
    if (reducedMotion || isSmallScreen) {
      return;
    }

    let ticking = false;
    function updateParallax() {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const viewportCenter = window.innerHeight * 0.5;
        const delta = rect.top + rect.height * 0.5 - viewportCenter;
        const shift = Math.max(-18, Math.min(18, delta * -0.04));
        section.style.backgroundPosition = `center calc(50% + ${shift}px)`;
      });
      ticking = false;
    }

    function requestParallax() {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }

    updateParallax();
    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax);
  }

  function initCardTilt() {
    const cards = Array.from(
      document.querySelectorAll('.about .slide, .expertise .slide, .contact-form, .contact-info')
    );
    if (!cards.length) {
      return;
    }

    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reducedMotion || !supportsHover) {
      return;
    }

    cards.forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        const rotateX = Math.max(-4, Math.min(4, -py * 7));
        const rotateY = Math.max(-4, Math.min(4, px * 7));
        card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  initParallaxSections();
  initCardTilt();
  initBeingQuestionRail();

  function applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }

  const savedTheme =
    localStorage.getItem('myqs-theme') ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('myqs-theme', nextTheme);
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', (event) => {
      event.preventDefault();
      toggleTheme();
    });
  }
});
