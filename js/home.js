/**
 * ============================================
 * MUHAMMAD HASSAN — HOME.JS
 * Homepage: Service Finder, Featured Projects
 * (Horizontal Scroll), Hero interactions
 * ============================================
 *
 * NOTE: Data Visualization Gallery removed.
 * Clean version — no unused functions.
 * ============================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initServiceFinder();
    initFeaturedProjects();
    initHeroInteractions();
    initHeroStats();
  }

  /* ============================================
     1. SERVICE FINDER (Mini-App)
     ============================================ */
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

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  /* ============================================
     2. FEATURED PROJECTS — HORIZONTAL SCROLL
     ============================================ */
  function initFeaturedProjects() {
    const scroll = document.getElementById('home-projects-grid');
    const wrap = document.getElementById('featured-scroll-wrap');
    const prevBtn = document.getElementById('featured-prev');
    const nextBtn = document.getElementById('featured-next');
    const progressBar = document.getElementById('featured-progress-bar');

    if (!scroll) return;
    if (typeof projectsData === 'undefined' || !Array.isArray(projectsData)) {
      console.warn('projectsData not found — skipping featured projects');
      return;
    }

    // Get featured projects (or first 6)
    let featured = projectsData.filter(p => p.featured === true);
    if (featured.length < 3) {
      featured = projectsData.slice(0, 6);
    }

    if (!featured.length) {
      scroll.innerHTML = '<p class="text-muted" style="text-align:center; padding: 2rem;">No projects available yet.</p>';
      return;
    }

    // Render cards
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

    // ---- Update arrows state ----
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

    // ---- Arrow click ----
    const scrollAmount = () => {
      const card = scroll.querySelector('.featured-card');
      if (!card) return 400;
      const cardWidth = card.getBoundingClientRect().width;
      return cardWidth + 24;
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        scroll.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        scroll.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      });
    }

    // ---- Drag to scroll (desktop) ----
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let moved = false;

    scroll.addEventListener('mousedown', (e) => {
      isDown = true;
      moved = false;
      scroll.style.cursor = 'grabbing';
      startX = e.pageX;
      scrollStart = scroll.scrollLeft;
    });

    scroll.addEventListener('mouseleave', () => {
      isDown = false;
      scroll.style.cursor = 'grab';
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
      scroll.style.cursor = 'grab';
    });

    scroll.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 5) moved = true;
      scroll.scrollLeft = scrollStart - walk;
    });

    // Prevent click after drag
    scroll.addEventListener('click', (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // ---- Scroll event ----
    let ticking = false;
    scroll.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateArrows();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // ---- Resize ----
    window.addEventListener('resize', updateArrows);

    // ---- Keyboard navigation ----
    scroll.setAttribute('tabindex', '0');
    scroll.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scroll.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scroll.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      }
    });

    // ---- Init ----
    setTimeout(updateArrows, 150);
    window.addEventListener('load', updateArrows);
  }

  /* ============================================
     3. HERO INTERACTIONS
     ============================================ */
  function initHeroInteractions() {
    const heroImg = document.querySelector('.hero-img-wrap');
    if (!heroImg) return;

    if (window.matchMedia('(hover: hover)').matches) {
      heroImg.addEventListener('mouseenter', () => {
        heroImg.style.animationPlayState = 'paused';
      });

      heroImg.addEventListener('mouseleave', () => {
        heroImg.style.animationPlayState = 'running';
      });
    }

    // Add particle container if not exists
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

  /* ============================================
     4. HERO STATS COUNTERS
     ============================================ */
  function initHeroStats() {
    const stats = document.querySelectorAll('.hero-stat-value .counter');
    if (!stats.length) return;

    stats.forEach(el => {
      if (!el.dataset.target) {
        const text = el.textContent.trim();
        const match = text.match(/[\d.]+/);
        if (match) {
          el.dataset.target = match[0];
          el.textContent = '0';
        }
      }
    });
  }

  /* ============================================
     HELPERS
     ============================================ */

  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();