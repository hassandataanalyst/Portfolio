(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      
      renderEducation(data.education);
      renderCertifications(data.certifications);
      
    } catch (error) {
      console.error('Error loading data for About page:', error);
    }
  });

  function renderEducation(educationList) {
    if (!educationList) return;
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    timeline.innerHTML = educationList.map(edu => `
      <div class="tl-item">
        <div class="tl-dot"></div>
        <h4>${escapeHTML(edu.degree)}</h4>
        <span class="tl-meta">${escapeHTML(edu.institution)} &middot; ${escapeHTML(edu.period)}</span>
        <p>${escapeHTML(edu.detail)}</p>
      </div>
    `).join('');
  }

  function renderCertifications(certs) {
    if (!certs) return;
    const certsList = document.querySelector('.certs-list');
    if (!certsList) return;

    certsList.innerHTML = certs.map(cert => `
      <a href="${escapeHTML(cert.file)}" target="_blank" rel="noopener noreferrer" class="cert-row">
        <div class="cert-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
        <div class="cert-details">
          <h4>${escapeHTML(cert.title)}</h4>
          <span>${escapeHTML(cert.issuer)} &middot; ${escapeHTML(cert.date)}</span>
        </div>
        <span class="cert-action">View PDF →</span>
      </a>
    `).join('');
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
})();