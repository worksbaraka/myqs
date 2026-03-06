document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
  }

  const savedTheme =
    localStorage.getItem('myqs-theme') ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  let toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) {
    toggleBtn = document.getElementById('shared-theme-toggle');
  }

  if (!toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.id = 'shared-theme-toggle';
    toggleBtn.className = 'shared-theme-toggle';
    toggleBtn.type = 'button';
    toggleBtn.setAttribute('aria-label', 'Toggle dark and light mode');
    toggleBtn.textContent = '🌗';
    document.body.appendChild(toggleBtn);
  }

  toggleBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const current = root.getAttribute('data-theme') || 'light';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('myqs-theme', nextTheme);
  });

  let progressBar = document.getElementById('scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'shared-scroll-progress';
    progressBar.className = 'shared-scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);
  }

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.width = `${Math.max(0, Math.min(100, ratio))}%`;
  }

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
});
