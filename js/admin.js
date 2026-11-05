(function () {
    'use strict';

    // --- Configuration ---
    const GITHUB_USER = 'hassandataanalyst';
    const GITHUB_REPO = 'Portfolio';
    const FILE_PATH = 'data.json';
    
    let currentData = null;
    let currentFileSha = null;
    let currentToken = null;

    // --- DOM Elements ---
    const loginScreen = document.getElementById('loginScreen');
    const dashboard = document.getElementById('dashboard');
    const tokenInput = document.getElementById('tokenInput');
    
    // --- INIT ---
    document.addEventListener('DOMContentLoaded', () => {
        const savedToken = localStorage.getItem('gh_token');
        if (savedToken) {
            currentToken = savedToken;
            tokenInput.value = savedToken;
            login();
        }
    });

    // --- LOGIN & FETCH DATA ---
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
            // Fetch current data.json from GitHub to get SHA and content
            const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FILE_PATH}`, {
                headers: { 'Authorization': `token ${token}` }
            });

            if (!res.ok) throw new Error('Invalid token or repository not found');
            
            const fileData = await res.json();
            currentFileSha = fileData.sha;
            
            // Decode base64 content
            const content = decodeURIComponent(escape(window.atob(fileData.content)));
            currentData = JSON.parse(content);

            // Save token
            localStorage.setItem('gh_token', token);
            currentToken = token;

            // Show Dashboard
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

    // --- TABS LOGIC ---
    window.switchTab = function(tabId, btn) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.admin-nav button').forEach(el => el.classList.remove('active'));
        document.getElementById('tab-' + tabId).classList.add('active');
        btn.classList.add('active');
    }

    // --- SAVE TO GITHUB API ---
    async function saveToGitHub() {
        const msg = prompt("Enter a commit message for this change:", "Update portfolio data via Admin Panel");
        if (msg === null) return; // User cancelled

        try {
            const contentEncoded = window.btoa(unescape(encodeURIComponent(JSON.stringify(currentData, null, 2))));
            
            const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FILE_PATH}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${currentToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: msg,
                    content: contentEncoded,
                    sha: currentFileSha
                })
            });

            if (!res.ok) {
                if(res.status === 401) throw new Error('Token is invalid or expired. Please check.');
                if(res.status === 404) throw new Error('Repository not found. Check username/repo name.');
                throw new Error('GitHub API Error: ' + res.statusText);
            }
            
            const data = await res.json();
            currentFileSha = data.content.sha; // Update SHA for next save
            alert('✅ Saved successfully! Your live website will update in 1-2 minutes.');
            
        } catch (error) {
            console.error(error);
            alert('❌ Error saving: ' + error.message);
        }
    }

    // ==========================================
    // 1. PROJECTS CRUD
    // ==========================================
    function renderAdminProjects() {
        const container = document.getElementById('admin-projects-list');
        if (!container) return;

        container.innerHTML = currentData.projects.map((p, index) => `
            <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--bg-dark-border); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: #fff;">${p.title}</h4>
                    <span style="font-size: 0.8rem; color: var(--neon-cyan);">${p.category} | Featured: ${p.featured ? 'Yes' : 'No'}</span>
                </div>
                <div>
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
    // 2. CERTIFICATES CRUD
    // ==========================================
    function renderAdminCertificates() {
        const container = document.getElementById('admin-certs-list');
        if (!container) return;

        container.innerHTML = currentData.certifications.map((c, index) => `
            <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--bg-dark-border); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: #fff;">${c.title}</h4>
                    <span style="font-size: 0.8rem; color: var(--neon-cyan);">${c.issuer}</span>
                </div>
                <div>
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="editCert(${index})">Edit</button>
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; color: #ff4d4d; border-color: #ff4d4d;" onclick="deleteCert(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    window.deleteCert = function(index) {
        if (confirm('Delete this certificate?')) {
            currentData.certifications.splice(index, 1);
            renderAdminCertificates();
            saveToGitHub();
        }
    }

    window.editCert = function(index) {
        const c = currentData.certifications[index];
        const newTitle = prompt("Certificate Title:", c.title);
        if (newTitle !== null) {
            c.title = newTitle;
            renderAdminCertificates();
            saveToGitHub();
        }
    }

    // ==========================================
    // 3. EDUCATION CRUD
    // ==========================================
    function renderAdminEducation() {
        const container = document.getElementById('admin-edu-list');
        if (!container) return;

        container.innerHTML = currentData.education.map((e, index) => `
            <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--bg-dark-border); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: #fff;">${e.degree}</h4>
                    <span style="font-size: 0.8rem; color: var(--neon-cyan);">${e.institution}</span>
                </div>
                <div>
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="editEdu(${index})">Edit</button>
                    <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; color: #ff4d4d; border-color: #ff4d4d;" onclick="deleteEdu(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    window.deleteEdu = function(index) {
        if (confirm('Delete this education entry?')) {
            currentData.education.splice(index, 1);
            renderAdminEducation();
            saveToGitHub();
        }
    }

    window.editEdu = function(index) {
        const e = currentData.education[index];
        const newDegree = prompt("Degree/Level:", e.degree);
        if (newDegree !== null) {
            e.degree = newDegree;
            renderAdminEducation();
            saveToGitHub();
        }
    }

})();