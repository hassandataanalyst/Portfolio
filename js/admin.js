(function () {
    'use strict';

    const GITHUB_USER = 'hassandataanalyst';
    const GITHUB_REPO = 'Portfolio';
    const FILE_PATH = 'data.json';
    
    let currentData = null;
    let currentFileSha = null;
    let currentToken = null;

    const loginScreen = document.getElementById('loginScreen');
    const dashboard = document.getElementById('dashboard');
    const tokenInput = document.getElementById('tokenInput');

    document.addEventListener('DOMContentLoaded', () => {
        const savedToken = localStorage.getItem('gh_token');
        if (savedToken) {
            currentToken = savedToken;
            tokenInput.value = savedToken;
            login();
        }
    });

    window.login = async function() {
        const token = tokenInput.value.trim();
        if (!token || !token.startsWith('ghp_')) {
            alert('Please enter a valid GitHub Token (starts with ghp_)');
            return;
        }

        const btn = document.querySelector('#loginScreen button');
        const originalText = btn.textContent;
        btn.textContent = 'Authenticating...';
        btn.disabled = true;

        try {
            const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FILE_PATH}`, {
                headers: { 'Authorization': `token ${token}` }
            });

            if (!res.ok) throw new Error('Invalid token or repository not found');
            
            const fileData = await res.json();
            currentFileSha = fileData.sha;
            const content = decodeURIComponent(escape(window.atob(fileData.content)));
            currentData = JSON.parse(content);

            localStorage.setItem('gh_token', token);
            currentToken = token;

            loginScreen.style.display = 'none';
            dashboard.style.display = 'flex';
            
            renderAdminProjects();
            renderAdminCertificates();
            renderAdminEducation();

        } catch (error) {
            console.error(error);
            alert('Login failed: ' + error.message);
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }

    window.logout = function() {
        localStorage.removeItem('gh_token');
        location.reload();
    }

    window.switchTab = function(tabId, btn) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.admin-nav button').forEach(el => el.classList.remove('active'));
        document.getElementById('tab-' + tabId).classList.add('active');
        btn.classList.add('active');
    }

    async function saveToGitHub() {
        const msg = prompt("Enter a commit message for this change:", "Update portfolio data via Admin Panel");
        if (msg === null) return;

        try {
            const contentEncoded = window.btoa(unescape(encodeURIComponent(JSON.stringify(currentData, null, 2))));
            const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FILE_PATH}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${currentToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: msg, content: contentEncoded, sha: currentFileSha })
            });

            if (!res.ok) throw new Error('Failed to save to GitHub');
            const data = await res.json();
            currentFileSha = data.content.sha;
            
            // Naya Notification System
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#10b981; color:#fff; padding:1rem; border-radius:8px; z-index:9999; font-weight:bold;';
            toast.textContent = '✅ Saved to GitHub! Site will update in 1-2 mins.';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);

        } catch (error) {
            console.error(error);
            alert('❌ Error saving: ' + error.message);
        }
    }

    // ==========================================
    // PROJECTS CRUD
    // ==========================================
    function renderAdminProjects() {
        const container = document.getElementById('admin-projects-list');
        if (!container) return;
        container.innerHTML = currentData.projects.map((p, index) => `
            <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--bg-dark-border); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: #fff; margin-bottom: 0.2rem;">${p.title}</h4>
                    <span style="font-size: 0.8rem; color: var(--neon-cyan);">${p.category} | Featured: ${p.featured ? 'Yes' : 'No'}</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="editProject(${index})">Edit</button>
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; color: #ff4d4d; border-color: #ff4d4d;" onclick="deleteProject(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    window.deleteProject = function(index) {
        if (confirm('Are you sure you want to delete this project?')) {
            currentData.projects.splice(index, 1);
            renderAdminProjects();
            saveToGitHub();
        }
    }

    window.editProject = function(index) {
        const p = currentData.projects[index];
        const newTitle = prompt("Project Title:", p.title);
        if (newTitle !== null) {
            p.title = newTitle;
            p.slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            renderAdminProjects();
            saveToGitHub();
        }
    }

    // ==========================================
    // CERTIFICATES CRUD
    // ==========================================
    function renderAdminCertificates() {
        const container = document.getElementById('admin-certs-list');
        if (!container) return;
        container.innerHTML = currentData.certifications.map((c, index) => `
            <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--bg-dark-border); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: #fff; margin-bottom: 0.2rem;">${c.title}</h4>
                    <span style="font-size: 0.85rem; color: var(--neon-cyan);">${c.issuer}</span>
                    <span style="font-size: 0.8rem; color: var(--text-dark-muted); display: block;">${c.date}</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="openCertForm(${index})">Edit</button>
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; color: #ff4d4d; border-color: #ff4d4d;" onclick="deleteCert(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    window.deleteCert = function(index) {
        if (confirm('Are you sure you want to delete this certificate?')) {
            currentData.certifications.splice(index, 1);
            renderAdminCertificates();
            saveToGitHub();
        }
    }

    window.openCertForm = function(index = -1) {
        const isEdit = index !== -1;
        const cert = isEdit ? currentData.certifications[index] : { title: '', issuer: '', date: '', file: '', verifyUrl: '' };
        
        document.getElementById('cert-form-title').textContent = isEdit ? 'Edit Certificate' : 'Add New Certificate';
        document.getElementById('cert-index').value = index;
        document.getElementById('cert-title').value = cert.title;
        document.getElementById('cert-issuer').value = cert.issuer;
        document.getElementById('cert-date').value = cert.date;
        document.getElementById('cert-file').value = cert.file;
        document.getElementById('cert-verify').value = cert.verifyUrl || '';
        
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

        if (index === -1) {
            currentData.certifications.push(newCert);
        } else {
            currentData.certifications[index] = newCert;
        }

        document.getElementById('cert-form-modal').style.display = 'none';
        renderAdminCertificates();
        saveToGitHub();
    }

    // ==========================================
    // EDUCATION CRUD
    // ==========================================
    function renderAdminEducation() {
        const container = document.getElementById('admin-edu-list');
        if (!container) return;
        container.innerHTML = currentData.education.map((e, index) => `
            <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--bg-dark-border); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: #fff; margin-bottom: 0.2rem;">${e.degree}</h4>
                    <span style="font-size: 0.85rem; color: var(--neon-cyan);">${e.institution}</span>
                    <span style="font-size: 0.8rem; color: var(--text-dark-muted); display: block;">${e.period} | ${e.detail}</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="openEduForm(${index})">Edit</button>
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; color: #ff4d4d; border-color: #ff4d4d;" onclick="deleteEdu(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    window.deleteEdu = function(index) {
        if (confirm('Are you sure you want to delete this education entry?')) {
            currentData.education.splice(index, 1);
            renderAdminEducation();
            saveToGitHub();
        }
    }

    window.openEduForm = function(index = -1) {
        const isEdit = index !== -1;
        const edu = isEdit ? currentData.education[index] : { degree: '', institution: '', period: '', detail: '' };
        
        document.getElementById('edu-form-title').textContent = isEdit ? 'Edit Education' : 'Add New Education';
        document.getElementById('edu-index').value = index;
        document.getElementById('edu-degree').value = edu.degree;
        document.getElementById('edu-institution').value = edu.institution;
        document.getElementById('edu-period').value = edu.period;
        document.getElementById('edu-detail').value = edu.detail;
        
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

        if (index === -1) {
            currentData.education.push(newEdu);
        } else {
            currentData.education[index] = newEdu;
        }

        document.getElementById('edu-form-modal').style.display = 'none';
        renderAdminEducation();
        saveToGitHub();
    }

})();