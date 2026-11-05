(function () {
    'use strict';

    const GITHUB_USER = 'hassandataanalyst';
    const GITHUB_REPO = 'Portfolio';
    const FILE_PATH = 'data.json';
    
    let currentData = null;
    let currentFileSha = null;
    let currentToken = null;

    document.addEventListener('DOMContentLoaded', () => {
        const savedToken = localStorage.getItem('gh_token');
        if (savedToken) { currentToken = savedToken; document.getElementById('tokenInput').value = savedToken; login(); }
    });

    window.login = async function() {
        const token = document.getElementById('tokenInput').value.trim();
        if (!token || !token.startsWith('ghp_')) { alert('Invalid Token'); return; }
        
        try {
            const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FILE_PATH}`, { headers: { 'Authorization': `token ${token}` } });
            if (!res.ok) throw new Error('Token or Repo not found');
            
            const fileData = await res.json();
            currentFileSha = fileData.sha;
            currentData = JSON.parse(decodeURIComponent(escape(window.atob(fileData.content))));

            if (!currentData.heroStats) {
                currentData.heroStats = { cgpa: "3.53", cgpaTotal: "4.00" };
            }

            localStorage.setItem('gh_token', token);
            currentToken = token;
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('dashboard').style.display = 'flex';
            
            renderAdminProjects();
            renderAdminCertificates();
            renderAdminEducation();
            openStatsForm();
        } catch (error) { alert('Login failed: ' + error.message); }
    }

    window.logout = function() { localStorage.removeItem('gh_token'); location.reload(); }
    window.switchTab = function(tabId, btn) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.admin-nav button').forEach(el => el.classList.remove('active'));
        document.getElementById('tab-' + tabId).classList.add('active');
        btn.classList.add('active');
    }

    async function saveToGitHub() {
        const msg = prompt("Enter a commit message:", "Update data via Admin Panel");
        if (msg === null) return;
        try {
            const contentEncoded = window.btoa(unescape(encodeURIComponent(JSON.stringify(currentData, null, 2))));
            const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FILE_PATH}`, {
                method: 'PUT', headers: { 'Authorization': `token ${currentToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, content: contentEncoded, sha: currentFileSha })
            });
            if (!res.ok) throw new Error('Failed to save');
            currentFileSha = (await res.json()).content.sha;
            
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#10b981; color:#fff; padding:1rem; border-radius:8px; z-index:9999; font-weight:bold;';
            toast.textContent = '✅ Saved! Live site will update in 1-2 mins.';
            document.body.appendChild(toast); setTimeout(() => toast.remove(), 3000);
        } catch (error) { alert('❌ Error: ' + error.message); }
    }

    // ==========================================
    // HERO STATS CRUD (CGPA)
    // ==========================================
    window.openStatsForm = function() {
        if (currentData.heroStats) {
            document.getElementById('stat-cgpa').value = currentData.heroStats.cgpa || "3.53";
            document.getElementById('stat-cgpa-total').value = currentData.heroStats.cgpaTotal || "4.00";
        }
    }

    window.saveStatsForm = function() {
        currentData.heroStats = {
            cgpa: document.getElementById('stat-cgpa').value,
            cgpaTotal: document.getElementById('stat-cgpa-total').value
        };
        saveToGitHub();
    }

    // ==========================================
    // PROJECTS CRUD
    // ==========================================
    function renderAdminProjects() {
        const container = document.getElementById('admin-projects-list');
        if (!container) return;
        container.innerHTML = currentData.projects.map((p, index) => `
            <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--bg-dark-border); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div><h4 style="color: #fff; margin-bottom: 0.2rem;">${p.title}</h4><span style="font-size: 0.8rem; color: var(--neon-cyan);">${p.category}</span></div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="openProjectForm(${index})">Edit</button>
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; color: #ff4d4d;" onclick="deleteProject(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    window.deleteProject = function(index) {
        if (confirm('Delete this project?')) { currentData.projects.splice(index, 1); renderAdminProjects(); saveToGitHub(); }
    }

    window.openProjectForm = function(index = -1) {
        const p = index !== -1 ? currentData.projects[index] : { title: '', category: '', shortDescription: '', technologies: [], imagePath: '', featured: false, sections: [] };
        document.getElementById('project-form-title').textContent = index !== -1 ? 'Edit Project' : 'Add Project';
        document.getElementById('project-index').value = index;
        document.getElementById('proj-title').value = p.title;
        document.getElementById('proj-category').value = p.category;
        document.getElementById('proj-desc').value = p.shortDescription;
        document.getElementById('proj-tech').value = p.technologies.join(', ');
        document.getElementById('proj-img').value = p.imagePath;
        document.getElementById('proj-featured').value = p.featured;

        const container = document.getElementById('dynamic-sections-container');
        container.innerHTML = '';
        (p.sections || []).forEach(sec => addProjectSection(sec.heading, sec.description));

        document.getElementById('project-form-modal').style.display = 'flex';
    }

    window.addProjectSection = function(heading = '', desc = '') {
        const container = document.getElementById('dynamic-sections-container');
        const div = document.createElement('div');
        div.className = 'form-group';
        div.style.cssText = 'background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; position: relative; margin-bottom: 1rem;';
        div.innerHTML = `
            <button onclick="this.parentElement.remove()" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 1.2rem;">&times;</button>
            <label>Section Heading</label>
            <input type="text" class="sec-heading" value="${heading}" style="margin-bottom: 0.5rem;">
            <label>Section Description</label>
            <textarea class="sec-desc" rows="3">${desc}</textarea>
        `;
        container.appendChild(div);
    }

    window.saveProjectForm = function() {
        const index = parseInt(document.getElementById('project-index').value);
        const sections = [];
        document.querySelectorAll('#dynamic-sections-container > div').forEach(div => {
            sections.push({
                heading: div.querySelector('.sec-heading').value,
                description: div.querySelector('.sec-desc').value
            });
        });

        const newProj = {
            title: document.getElementById('proj-title').value,
            slug: document.getElementById('proj-title').value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category: document.getElementById('proj-category').value,
            shortDescription: document.getElementById('proj-desc').value,
            technologies: document.getElementById('proj-tech').value.split(',').map(t => t.trim()).filter(t => t),
            imagePath: document.getElementById('proj-img').value,
            featured: document.getElementById('proj-featured').value.toLowerCase() === 'true',
            sections: sections,
            status: 'Demo Project',
            githubUrl: '', liveUrl: ''
        };

        if (index === -1) currentData.projects.push(newProj);
        else currentData.projects[index] = newProj;

        document.getElementById('project-form-modal').style.display = 'none';
        renderAdminProjects(); saveToGitHub();
    }

    // ==========================================
    // CERTIFICATES CRUD
    // ==========================================
    function renderAdminCertificates() {
        const container = document.getElementById('admin-certs-list');
        if (!container) return;
        container.innerHTML = currentData.certifications.map((c, index) => `
            <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--bg-dark-border); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div><h4 style="color: #fff;">${c.title}</h4><span style="font-size: 0.85rem; color: var(--neon-cyan);">${c.issuer}</span></div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="openCertForm(${index})">Edit</button>
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; color: #ff4d4d;" onclick="deleteCert(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    window.deleteCert = function(index) {
        if (confirm('Delete this certificate?')) { currentData.certifications.splice(index, 1); renderAdminCertificates(); saveToGitHub(); }
    }

    window.openCertForm = function(index = -1) {
        const c = index !== -1 ? currentData.certifications[index] : { title: '', issuer: '', date: '', file: '', verifyUrl: '' };
        document.getElementById('cert-form-title').textContent = index !== -1 ? 'Edit Certificate' : 'Add Certificate';
        document.getElementById('cert-index').value = index;
        document.getElementById('cert-title').value = c.title;
        document.getElementById('cert-issuer').value = c.issuer;
        document.getElementById('cert-date').value = c.date;
        document.getElementById('cert-file').value = c.file;
        document.getElementById('cert-verify').value = c.verifyUrl || '';
        document.getElementById('cert-form-modal').style.display = 'flex';
    }

    window.saveCertForm = function() {
        const index = parseInt(document.getElementById('cert-index').value);
        const newCert = {
            title: document.getElementById('cert-title').value,
            issuer: document.getElementById('cert-issuer').value,
            date: document.getElementById('cert-date').value,
            file: document.getElementById('cert-file').value,
            verifyUrl: document.getElementById('cert-verify').value
        };
        if (index === -1) currentData.certifications.push(newCert); else currentData.certifications[index] = newCert;
        document.getElementById('cert-form-modal').style.display = 'none';
        renderAdminCertificates(); saveToGitHub();
    }

    // ==========================================
    // EDUCATION CRUD
    // ==========================================
    function renderAdminEducation() {
        const container = document.getElementById('admin-edu-list');
        if (!container) return;
        container.innerHTML = currentData.education.map((e, index) => `
            <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--bg-dark-border); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div><h4 style="color: #fff;">${e.degree}</h4><span style="font-size: 0.85rem; color: var(--neon-cyan);">${e.institution}</span></div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="openEduForm(${index})">Edit</button>
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; color: #ff4d4d;" onclick="deleteEdu(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    window.deleteEdu = function(index) {
        if (confirm('Delete this education?')) { currentData.education.splice(index, 1); renderAdminEducation(); saveToGitHub(); }
    }

    window.openEduForm = function(index = -1) {
        const e = index !== -1 ? currentData.education[index] : { degree: '', institution: '', period: '', detail: '' };
        document.getElementById('edu-form-title').textContent = index !== -1 ? 'Edit Education' : 'Add Education';
        document.getElementById('edu-index').value = index;
        document.getElementById('edu-degree').value = e.degree;
        document.getElementById('edu-institution').value = e.institution;
        document.getElementById('edu-period').value = e.period;
        document.getElementById('edu-detail').value = e.detail;
        document.getElementById('edu-form-modal').style.display = 'flex';
    }

    window.saveEduForm = function() {
        const index = parseInt(document.getElementById('edu-index').value);
        const newEdu = {
            degree: document.getElementById('edu-degree').value,
            institution: document.getElementById('edu-institution').value,
            period: document.getElementById('edu-period').value,
            detail: document.getElementById('edu-detail').value
        };
        if (index === -1) currentData.education.push(newEdu); else currentData.education[index] = newEdu;
        document.getElementById('edu-form-modal').style.display = 'none';
        renderAdminEducation(); saveToGitHub();
    }

})();