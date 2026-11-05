(function () {
  'use strict';

  let portfolioData = { projects: [] };
  let currentFocus = null;

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('data.json');
      portfolioData = await response.json();
      initProjectsPage();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  });

  function initProjectsPage() {
    const gallery = document.getElementById('projects-gallery');
    const dynamicFilters = document.getElementById('dynamic-filters');
    const drawer = document.getElementById('case-study-drawer');
    const drawerBody = document.getElementById('drawer-body');
    const closeBtn = document.querySelector('.close-drawer');
    const backdrop = document.querySelector('.drawer-backdrop');
    const filterContainer = document.querySelector('.filters-container');

    if (!gallery || !portfolioData.projects) return;

    // 1. Generate Filters
    if (dynamicFilters) {
      const categories = [...new Set(portfolioData.projects.map(p => p.category).filter(Boolean))];
      dynamicFilters.innerHTML = categories.map(cat => `
        <button class="filter-btn" data-filter="${escapeHTML(cat)}" type="button">
          ${escapeHTML(cat)}
        </button>
      `).join('');
    }

    // 2. Render Gallery
    function renderGallery(filter = 'all') {
      const filtered = filter === 'all' ? portfolioData.projects : portfolioData.projects.filter(p => p.category === filter);

      if (!filtered.length) {
        gallery.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 3rem 1rem;"><p class="text-muted">No projects found.</p></div>`;
        return;
      }

      gallery.innerHTML = filtered.map(p => `
        <article class="gallery-card" data-slug="${escapeHTML(p.slug)}" data-tilt data-tilt-max="4" tabindex="0" role="button">
          <div class="gal-img">
            <img src="${escapeHTML(p.imagePath)}" alt="${escapeHTML(p.title)}" loading="lazy" onerror="this.style.display='none'">
            <span class="gal-badge">${escapeHTML(p.status || 'Project')}</span>
          </div>
          <div class="gal-content">
            <span class="gal-cat">${escapeHTML(p.category || '')}</span>
            <h3>${escapeHTML(p.title)}</h3>
            <p class="gal-desc">${escapeHTML(p.shortDescription || '')}</p>
            <button class="btn btn-outline read-more-btn" data-slug="${escapeHTML(p.slug)}" type="button">Read Case Study</button>
          </div>
        </article>
      `).join('');

      attachCardEvents(gallery, drawer, drawerBody);
      if (window.bindTiltToNewElements) window.bindTiltToNewElements(gallery);
    }

    renderGallery();

    // 3. Filter Logic
    if (filterContainer) {
      filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGallery(btn.getAttribute('data-filter'));
      });
    }

    // 4. Close Drawer Logic (FIXED)
    function closeDrawer() {
      if (!drawer) return;
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (history.replaceState) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      if (currentFocus && typeof currentFocus.focus === 'function') {
        currentFocus.focus();
        currentFocus = null;
      }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // 5. Hash on Load
    if (window.location.hash) {
      const hashSlug = window.location.hash.substring(1);
      const project = portfolioData.projects.find(p => p.slug === hashSlug);
      if (project) {
        setTimeout(() => openDrawer(hashSlug, document.body, drawer, drawerBody), 400);
      }
    }

    window.addEventListener('hashchange', () => {
      const hashSlug = window.location.hash.substring(1);
      if (!hashSlug) {
        if (drawer && drawer.classList.contains('open')) closeDrawer();
        return;
      }
      const project = portfolioData.projects.find(p => p.slug === hashSlug);
      if (project && drawer && !drawer.classList.contains('open')) {
        openDrawer(hashSlug, document.body, drawer, drawerBody);
      }
    });
  }

  // --- Helper Functions ---

  function attachCardEvents(gallery, drawer, drawerBody) {
    gallery.querySelectorAll('.read-more-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDrawer(btn.getAttribute('data-slug'), btn, drawer, drawerBody);
      });
    });

    gallery.querySelectorAll('.gallery-card').forEach(card => {
      card.addEventListener('click', () => openDrawer(card.getAttribute('data-slug'), card, drawer, drawerBody));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawer(card.getAttribute('data-slug'), card, drawer, drawerBody); }
      });
    });
  }

  function openDrawer(slug, triggerElement, drawer, drawerBody) {
    const project = portfolioData.projects.find(p => p.slug === slug);
    if (!project || !drawer || !drawerBody) return;

    currentFocus = triggerElement;
    const toolsHTML = (project.technologies || []).map(t => `<span class="badge">${escapeHTML(t)}</span>`).join('');
    
    const sectionsHTML = (project.sections || []).map(s => `
      <h3>${escapeHTML(s.heading)}</h3>
      <p>${escapeHTML(s.description)}</p>
    `).join('');

    let actions = [];
    if (project.githubUrl) actions.push(`<a href="${escapeHTML(project.githubUrl)}" class="btn btn-outline" target="_blank">View on GitHub</a>`);
    if (project.liveUrl) actions.push(`<a href="${escapeHTML(project.liveUrl)}" class="btn btn-primary" target="_blank">Live Demo</a>`);
    if (!actions.length) actions.push(`<a href="https://mail.google.com/mail/?view=cm&fs=1&to=muhassanbasri@gmail.com" class="btn btn-primary" target="_blank">Discuss Similar Project</a>`);

    drawerBody.innerHTML = `
      <div class="drawer-hero">
        <span class="drawer-status">${escapeHTML(project.status || 'Project')}</span>
        <h2>${escapeHTML(project.title)}</h2>
        <div class="drawer-tools">${toolsHTML}</div>
      </div>
      ${project.imagePath ? `<img src="${escapeHTML(project.imagePath)}" class="drawer-main-img" onerror="this.style.display='none'">` : ''}
      <div class="drawer-text">${sectionsHTML}</div>
      <div class="drawer-actions">${actions.join('')}</div>
    `;

    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (history.pushState) history.pushState(null, '', '#' + slug);

    setTimeout(() => drawer.querySelector('.drawer-content')?.focus(), 100);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

})();