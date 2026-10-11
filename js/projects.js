/**
 * ============================================
 * MUHAMMAD HASSAN — PROJECTS.JS
 * Projects gallery, filters, case study drawer
 * Fixed: field name mismatches, XSS safety, better UX
 * ============================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    if (typeof projectsData === 'undefined' || !Array.isArray(projectsData)) {
      console.warn('projectsData not found');
      return;
    }

    const gallery = document.getElementById('projects-gallery');
    const dynamicFilters = document.getElementById('dynamic-filters');
    const drawer = document.getElementById('case-study-drawer');
    const drawerBody = document.getElementById('drawer-body');
    const closeBtn = document.querySelector('.close-drawer');
    const backdrop = document.querySelector('.drawer-backdrop');
    const filterContainer = document.querySelector('.filters-container');

    if (!gallery) return;

    let currentFocus = null;

    /* ============================================
       1. GENERATE DYNAMIC FILTERS
       ============================================ */
    if (dynamicFilters) {
      const categories = [...new Set(
        projectsData.map(p => p.category).filter(Boolean)
      )];

      dynamicFilters.innerHTML = categories.map(cat => `
        <button class="filter-btn" data-filter="${escapeHTML(cat)}" type="button">
          ${escapeHTML(cat)}
        </button>
      `).join('');
    }

    /* ============================================
       2. RENDER GALLERY
       ============================================ */
    function renderGallery(filter = 'all') {
      const filtered = filter === 'all'
        ? projectsData
        : projectsData.filter(p => p.category === filter);

      if (!filtered.length) {
        gallery.innerHTML = `
          <div style="grid-column: 1/-1; text-align:center; padding: 3rem 1rem;">
            <p class="text-muted">No projects found in this category.</p>
          </div>
        `;
        return;
      }

      gallery.innerHTML = filtered.map(p => `
        <article class="gallery-card"
                 data-slug="${escapeHTML(p.slug)}"
                 data-tilt
                 data-tilt-max="4"
                 tabindex="0"
                 role="button"
                 aria-label="Read case study: ${escapeHTML(p.title)}">
          <div class="gal-img">
            <img src="${escapeHTML(p.imagePath)}"
                 alt="${escapeHTML(p.title)}"
                 loading="lazy"
                 onerror="this.style.display='none'">
            <span class="gal-badge">${escapeHTML(p.status || 'Project')}</span>
          </div>
          <div class="gal-content">
            <span class="gal-cat">${escapeHTML(p.category || '')}</span>
            <h3>${escapeHTML(p.title)}</h3>
            <p class="gal-desc">${escapeHTML(p.shortDescription || '')}</p>
            <button class="btn btn-outline read-more-btn"
                    data-slug="${escapeHTML(p.slug)}"
                    type="button"
                    aria-label="Open case study for ${escapeHTML(p.title)}">
              Read Case Study
            </button>
          </div>
        </article>
      `).join('');

      attachCardEvents();
      bindTilt();
    }

    /* ============================================
       3. ATTACH CARD EVENTS
       ============================================ */
    function attachCardEvents() {
      gallery.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const slug = btn.getAttribute('data-slug');
          if (slug) openDrawer(slug, btn);
        });
      });

      gallery.querySelectorAll('.gallery-card').forEach(card => {
        card.addEventListener('click', () => {
          const slug = card.getAttribute('data-slug');
          if (slug) openDrawer(slug, card);
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const slug = card.getAttribute('data-slug');
            if (slug) openDrawer(slug, card);
          }
        });
      });
    }

    /* ============================================
       4. BIND TILT
       ============================================ */
    function bindTilt() {
      if (window.matchMedia('(hover: none)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gallery.querySelectorAll('[data-tilt]').forEach(el => {
        if (el.dataset.tiltBound === 'true') return;
        el.dataset.tiltBound = 'true';

        const maxTilt = parseFloat(el.dataset.tiltMax) || 5;

        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const cx = rect.width / 2;
          const cy = rect.height / 2;
          const rx = ((y - cy) / cy) * -maxTilt;
          const ry = ((x - cx) / cx) * maxTilt;
          el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = '';
        });
      });
    }

    /* ============================================
       5. INITIAL RENDER
       ============================================ */
    renderGallery();

    /* ============================================
       6. FILTER LOGIC
       ============================================ */
    if (filterContainer) {
      filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        filterContainer.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');
        renderGallery(filter);

        const gallerySection = document.querySelector('.gallery-sec');
        if (gallerySection) {
          const top = gallerySection.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    }

    /* ============================================
       7. CASE STUDY DRAWER
       ============================================ */
    function openDrawer(slug, triggerElement) {
      const project = projectsData.find(p => p.slug === slug);
      if (!project || !drawer || !drawerBody) return;

      currentFocus = triggerElement || null;

      const toolsHTML = (project.technologies || [])
        .map(t => `<span class="badge">${escapeHTML(t)}</span>`)
        .join('');

      // FIXED field names: overview, problemStatement, methodology, insights, learningObjectives
      const sections = [
        { title: 'Overview', content: project.overview },
        { title: 'Problem Statement', content: project.problemStatement },
        { title: 'Methodology', content: project.methodology },
        { title: 'Key Insights', content: project.insights },
        { title: 'Learning Outcomes', content: project.learningObjectives }
      ].filter(s => s.content && String(s.content).trim());

      const sectionsHTML = sections.map(s => `
        <h3>${escapeHTML(s.title)}</h3>
        <p>${escapeHTML(s.content)}</p>
      `).join('');

      const actions = [];
      if (project.githubUrl && project.githubUrl.trim()) {
        actions.push(`
          <a href="${escapeHTML(project.githubUrl)}"
             class="btn btn-outline"
             target="_blank"
             rel="noopener noreferrer">
            View on GitHub
          </a>
        `);
      }
      if (project.liveUrl && project.liveUrl.trim()) {
        actions.push(`
          <a href="${escapeHTML(project.liveUrl)}"
             class="btn btn-primary"
             target="_blank"
             rel="noopener noreferrer">
            Live Demo
          </a>
        `);
      }
      if (!actions.length) {
        actions.push(`
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=muhassanbasri@gmail.com&su=Interested%20in%20${encodeURIComponent(project.title)}"
             class="btn btn-primary"
             target="_blank"
             rel="noopener noreferrer">
            Discuss Similar Project
          </a>
        `);
      }

      drawerBody.innerHTML = `
        <div class="drawer-hero">
          <span class="drawer-status">${escapeHTML(project.status || 'Project')}</span>
          <h2>${escapeHTML(project.title)}</h2>
          <div class="drawer-tools">${toolsHTML}</div>
        </div>

        ${project.imagePath ? `
          <img src="${escapeHTML(project.imagePath)}"
               alt="${escapeHTML(project.title)}"
               class="drawer-main-img"
               onerror="this.style.display='none'">
        ` : ''}

        <div class="drawer-text">
          ${sectionsHTML}
        </div>

        <div class="drawer-actions">
          ${actions.join('')}
        </div>
      `;

      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (history.pushState) {
        history.pushState(null, '', '#' + slug);
      }

      setTimeout(() => {
        const content = drawer.querySelector('.drawer-content');
        if (content) content.focus();
      }, 100);
    }

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

    /* ============================================
       8. DRAWER EVENTS
       ============================================ */
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    if (drawer) {
      drawer.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const focusable = drawer.querySelectorAll(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    }

    /* ============================================
       9. HASH ON LOAD
       ============================================ */
    if (window.location.hash) {
      const hashSlug = window.location.hash.substring(1);
      const project = projectsData.find(p => p.slug === hashSlug);
      if (project) {
        setTimeout(() => {
          openDrawer(hashSlug, document.body);
        }, 400);
      }
    }

    /* ============================================
       10. HASH CHANGE
       ============================================ */
    window.addEventListener('hashchange', () => {
      const hashSlug = window.location.hash.substring(1);
      if (!hashSlug) {
        if (drawer && drawer.classList.contains('open')) closeDrawer();
        return;
      }
      const project = projectsData.find(p => p.slug === hashSlug);
      if (project && drawer && !drawer.classList.contains('open')) {
        openDrawer(hashSlug, document.body);
      }
    });

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

  }

})();