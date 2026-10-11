/**
 * ============================================
 * MUHAMMAD HASSAN — MAIN.JS
 * Global functionality: navigation, header, menu,
 * copy email, dynamic year, active link detection
 * ============================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initCurrentYear();
    initMobileMenu();
    initHeaderScroll();
    initActiveNav();
    initCopyEmail();
    initSmoothAnchorScroll();
    initExternalLinks();
    initPageTransitions();
  }

  /* ============================================
     1. DYNAMIC YEAR (Footer)
     ============================================ */
  function initCurrentYear() {
    const yearSpans = document.querySelectorAll('#current-year, .current-year');
    const year = new Date().getFullYear();
    yearSpans.forEach(span => {
      span.textContent = year;
    });
  }

  /* ============================================
     2. MOBILE MENU
     ============================================ */
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!menuToggle || !mobileMenu) return;

    const menuIcon = menuToggle.querySelector('svg');
    const ICON_HAMBURGER = '<path d="M4 6h16M4 12h16M4 18h16"></path>';
    const ICON_CLOSE = '<path d="M6 18L18 6M6 6l12 12"></path>';

    function openMenu() {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (menuIcon) menuIcon.innerHTML = ICON_CLOSE;
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (menuIcon) menuIcon.innerHTML = ICON_HAMBURGER;
    }

    function toggleMenu() {
      if (mobileMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    menuToggle.addEventListener('click', toggleMenu);

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
        menuToggle.focus();
      }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
          closeMenu();
        }
      }, 150);
    });

    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });
  }

  /* ============================================
     3. HEADER SCROLL BEHAVIOR
     ============================================ */
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;
    const threshold = 8;

    function updateHeader() {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        header.classList.remove('scroll-up', 'scroll-down', 'scrolled');
        lastScroll = 0;
        ticking = false;
        return;
      }

      if (currentScroll > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      if (Math.abs(currentScroll - lastScroll) < threshold) {
        ticking = false;
        return;
      }

      if (currentScroll > lastScroll) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
      } else {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
      }

      lastScroll = currentScroll;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    updateHeader();
  }

  /* ============================================
     4. ACTIVE NAV LINK DETECTION
     ============================================ */
  function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-menu a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      if (href.startsWith('#')) return;

      const linkPath = href.split('#')[0].split('/').pop();

      if (linkPath === currentPath ||
          (currentPath === '' && linkPath === 'index.html') ||
          (currentPath === 'index.html' && linkPath === '')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /* ============================================
     5. COPY EMAIL UTILITY
     ============================================ */
  function initCopyEmail() {
    const copyBtns = document.querySelectorAll('.copy-email-btn');
    if (!copyBtns.length) return;

    const EMAIL = 'muhassanbasri@gmail.com';

    copyBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();

        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(EMAIL);
          } else {
            const textarea = document.createElement('textarea');
            textarea.value = EMAIL;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
          }

          const originalHTML = btn.innerHTML;
          btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
          `;
          btn.style.color = 'var(--neon-emerald)';
          btn.style.borderColor = 'var(--neon-emerald)';

          if (window.PortfolioUtils && window.PortfolioUtils.showToast) {
            window.PortfolioUtils.showToast('Email copied to clipboard');
          }

          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.color = '';
            btn.style.borderColor = '';
          }, 2200);

        } catch (err) {
          console.error('Copy failed:', err);
          window.prompt('Copy email manually:', EMAIL);
        }
      });
    });
  }

  /* ============================================
     6. SMOOTH ANCHOR SCROLL
     ============================================ */
  function initSmoothAnchorScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href === '#' || href === '#main-content') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const offset = 90;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top, behavior: 'smooth' });

      if (history.pushState) {
        history.pushState(null, '', href);
      }
    });
  }

  /* ============================================
     7. EXTERNAL LINKS
     ============================================ */
  function initExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
      if (link.hostname === window.location.hostname) return;

      if (!link.hasAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
      }
    });
  }

  /* ============================================
     8. PAGE TRANSITIONS
     ============================================ */
  function initPageTransitions() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (href.startsWith('http') && link.hostname !== window.location.hostname) return;
      if (link.target === '_blank') return;
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;

      e.preventDefault();
      document.body.style.opacity = '0';

      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  }

})();