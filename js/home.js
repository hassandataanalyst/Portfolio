(function () {
  'use strict';

  let portfolioData = { projects: [] };

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('data.json');
      portfolioData = await response.json();
      
      initServiceFinder(); // Yeh abhi hardcoded hai, thik hai
      initFeaturedProjects();
      initHeroInteractions();
      initHeroStats();
      
    } catch (error) {
      console.error('Error loading data:', error);
    }
  });

  function initServiceFinder() {
    const finderBtns = document.querySelectorAll('.finder-btn');
    const finderPanels = document.querySelectorAll('.finder-panel');
    if (!finderBtns.length || !finderPanels.length) return;

    finderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        if (!targetId) return;

        finderBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        finderPanels.forEach(p => p.classList.remove('active'));
        const targetPanel = document.getElementById('result-' + targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  function initFeaturedProjects() {
    const scroll = document.getElementById('home-projects-grid');
    const wrap = document.getElementById('featured-scroll-wrap');
    const prevBtn = document.getElementById('featured-prev');
    const nextBtn = document.getElementById('featured-next');
    const progressBar = document.getElementById('featured-progress-bar');

    if (!scroll || !portfolioData.projects) return;

    let featured = portfolioData.projects.filter(p => p.featured === true);
    if (featured.length < 3) {
      featured = portfolioData.projects.slice(0, 6);
    }

    if (!featured.length) {
      scroll.innerHTML = '<p class="text-muted" style="text-align:center; padding: 2rem;">No projects available yet.</p>';
      return;
    }

    scroll.innerHTML = featured.map((p) => {
      const tools = (p.technologies || []).slice(0, 4);
      const toolsHTML = tools.map(t => `<span>${escapeHTML(t)}</span>`).join('');

      return `
        <a href="projects.html#${escapeHTML(p.slug)}"
           class="featured-card"
           aria-label="View project: ${escapeHTML(p.title)}">
          <div class="proj-img">
            <img src="${escapeHTML(p.imagePath)}"
                 alt="${escapeHTML(p.title)}"
                 loading="lazy"
                 onerror="this.style.display='none'">
            <span class="proj-badge">${escapeHTML(p.status || 'Project')}</span>
          </div>
          <div class="proj-content">
            <span class="proj-cat">${escapeHTML(p.category || '')}</span>
            <h3>${escapeHTML(p.title)}</h3>
            <p class="proj-tools">${toolsHTML}</p>
          </div>
        </a>
      `;
    }).join('');

    function updateArrows() {
      const maxScroll = scroll.scrollWidth - scroll.clientWidth;
      if (prevBtn) prevBtn.disabled = scroll.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = scroll.scrollLeft >= maxScroll - 4;

      if (progressBar) {
        const ratio = scroll.clientWidth / scroll.scrollWidth;
        const visibleWidth = Math.max(ratio * 100, 12);
        const maxTranslate = 100 - visibleWidth;
        const scrollRatio = maxScroll > 0 ? scroll.scrollLeft / maxScroll : 0;
        progressBar.style.width = visibleWidth + '%';
        progressBar.style.transform = `translateX(${scrollRatio * (100 / visibleWidth) * maxTranslate}%)`;
      }

      if (wrap) {
        wrap.classList.toggle('at-start', scroll.scrollLeft <= 4);
        wrap.classList.toggle('at-end', scroll.scrollLeft >= maxScroll - 4);
        wrap.classList.toggle('not-at-start', scroll.scrollLeft > 4);
        wrap.classList.toggle('not-at-end', scroll.scrollLeft < maxScroll - 4);
      }
    }

    const scrollAmount = () => {
      const card = scroll.querySelector('.featured-card');
      return card ? card.getBoundingClientRect().width + 24 : 400;
    };

    if (prevBtn) prevBtn.addEventListener('click', () => scroll.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    if (nextBtn) nextBtn.addEventListener('click', () => scroll.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));

    let isDown = false, startX = 0, scrollStart = 0, moved = false;

    scroll.addEventListener('mousedown', (e) => {
      isDown = true; moved = false; scroll.style.cursor = 'grabbing';
      startX = e.pageX; scrollStart = scroll.scrollLeft;
    });

    scroll.addEventListener('mouseleave', () => { isDown = false; scroll.style.cursor = 'grab'; });
    window.addEventListener('mouseup', () => { isDown = false; scroll.style.cursor = 'grab'; });

    scroll.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 5) moved = true;
      scroll.scrollLeft = scrollStart - walk;
    });

    scroll.addEventListener('click', (e) => {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    let ticking = false;
    scroll.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => { updateArrows(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateArrows);
    
    scroll.setAttribute('tabindex', '0');
    scroll.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); scroll.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); scroll.scrollBy({ left: scrollAmount(), behavior: 'smooth' }); }
    });

    setTimeout(updateArrows, 150);
    window.addEventListener('load', updateArrows);
  }

  function initHeroInteractions() {
    const heroImg = document.querySelector('.hero-img-wrap');
    if (!heroImg) return;
    if (window.matchMedia('(hover: hover)').matches) {
      heroImg.addEventListener('mouseenter', () => heroImg.style.animationPlayState = 'paused');
      heroImg.addEventListener('mouseleave', () => heroImg.style.animationPlayState = 'running');
    }
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && !heroVisual.querySelector('.hero-particles')) {
      const particleContainer = document.createElement('div');
      particleContainer.className = 'hero-particles';
      particleContainer.style.position = 'absolute';
      particleContainer.style.inset = '0';
      particleContainer.style.pointerEvents = 'none';
      particleContainer.style.zIndex = '0';
      heroVisual.insertBefore(particleContainer, heroVisual.firstChild);
    }
  }

  function initHeroStats() {
    const stats = document.querySelectorAll('.hero-stat-value .counter');
    stats.forEach(el => {
      if (!el.dataset.target) {
        const text = el.textContent.trim();
        const match = text.match(/[\d.]+/);
        if (match) { el.dataset.target = match[0]; el.textContent = '0'; }
      }
    });
  }

  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

})();