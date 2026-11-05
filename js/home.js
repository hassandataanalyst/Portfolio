(function () {
  'use strict';

  let portfolioData = { projects: [], certifications: [], heroStats: { cgpa: "3.53", cgpaTotal: "4.00" } };

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('data.json');
      portfolioData = await response.json();
      
      initServiceFinder();
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
    if (!finderBtns.length) return;
    finderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        if (!targetId) return;
        finderBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        finderPanels.forEach(p => p.classList.remove('active'));
        const targetPanel = document.getElementById('result-' + targetId);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

  function initFeaturedProjects() {
    const section = document.getElementById('featured-projects-section');
    const scroll = document.getElementById('home-projects-grid');
    const wrap = document.getElementById('featured-scroll-wrap');
    const prevBtn = document.getElementById('featured-prev');
    const nextBtn = document.getElementById('featured-next');
    const progressBar = document.getElementById('featured-progress-bar');

    if (!scroll || !portfolioData.projects) return;

    // HIDE SECTION IF NO PROJECTS
    if (portfolioData.projects.length === 0) {
      if (section) section.style.display = 'none';
      return;
    } else {
      if (section) section.style.display = 'block';
    }

    let featured = portfolioData.projects.filter(p => p.featured === true);
    if (featured.length < 3) featured = portfolioData.projects.slice(0, 6);

    if (!featured.length) {
      if (section) section.style.display = 'none';
      return;
    }

    scroll.innerHTML = featured.map((p) => {
      const tools = (p.technologies || []).slice(0, 4);
      const toolsHTML = tools.map(t => `<span>${escapeHTML(t)}</span>`).join('');
      return `
        <a href="projects.html#${escapeHTML(p.slug)}" class="featured-card">
          <div class="proj-img">
            <img src="${escapeHTML(p.imagePath)}" alt="${escapeHTML(p.title)}" loading="lazy" onerror="this.style.display='none'">
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
    scroll.addEventListener('mousedown', (e) => { isDown = true; moved = false; scroll.style.cursor = 'grabbing'; startX = e.pageX; scrollStart = scroll.scrollLeft; });
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
    scroll.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

    let ticking = false;
    scroll.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => { updateArrows(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateArrows);
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
  }

  function initHeroStats() {
    const statsElements = document.querySelectorAll('.hero-stat-value');
    if (!statsElements.length) return;

    const projectsCount = portfolioData.projects ? portfolioData.projects.length : 0;
    const certsCount = portfolioData.certifications ? portfolioData.certifications.length : 0;
    const cgpaData = portfolioData.heroStats || { cgpa: "0", cgpaTotal: "4.00" };

    // CGPA
    if (statsElements[0]) {
      const cgpaCounter = statsElements[0].querySelector('.counter');
      if (cgpaCounter) {
        cgpaCounter.setAttribute('data-target', cgpaData.cgpa);
        const dec = cgpaData.cgpa.toString().split('.')[1];
        cgpaCounter.setAttribute('data-decimals', dec ? dec.length : 0);
        cgpaCounter.textContent = '0';
      }
      const cgpaLabel = statsElements[0].parentElement.querySelector('.hero-stat-label');
      if (cgpaLabel) cgpaLabel.innerHTML = `CGPA / ${cgpaData.cgpaTotal}`;
    }

    // Projects
    if (statsElements[1]) {
      const projCounter = statsElements[1].querySelector('.counter');
      if (projCounter) {
        projCounter.setAttribute('data-target', projectsCount);
        projCounter.setAttribute('data-suffix', projectsCount > 99 ? '+' : '');
        projCounter.textContent = '0';
      }
    }

    // Certifications
    if (statsElements[2]) {
      const certCounter = statsElements[2].querySelector('.counter');
      if (certCounter) {
        certCounter.setAttribute('data-target', certsCount);
        certCounter.textContent = '0';
      }
    }

    if (window.PortfolioUtils && window.PortfolioUtils.initCounters) {
      window.PortfolioUtils.initCounters(); 
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

})();