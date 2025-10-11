document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    //  1. DATABASE (Simulated with JavaScript Arrays)
    //  EDIT THIS SECTION TO ADD YOUR PROJECTS AND USERS
    // =================================================================

    const projectsData = [
        {
            id: 'proj1',
            title: 'Sentiment Analysis Engine',
            description: 'A neural network model that determines emotional tone from text data. Built with TensorFlow and Python.',
            tags: ['NLP', 'TensorFlow', 'Python']
        },
        {
            id: 'proj2',
            title: 'Image Recognition API',
            description: 'A REST API that can classify objects in images with 95% accuracy. Powered by PyTorch.',
            tags: ['Computer Vision', 'PyTorch', 'API']
        },
        {
            id: 'proj3',
            title: 'Predictive Sales Forecaster',
            description: 'An XGBoost model to predict future sales trends based on historical data and market indicators.',
            tags: ['Machine Learning', 'XGBoost', 'Data Science']
        }
    ];

    // Default users. In a real app, this comes from a database.
    // admin user: admin / password123
    // normal user: user / password123
    const initialUsers = [
        {
            username: 'admin',
            password: 'password123',
            isAdmin: true,
            isTrusted: true,
            tags: ['Admin'],
            favorites: ['proj1', 'proj3']
        },
        {
            username: 'user',
            password: 'password123',
            isAdmin: false,
            isTrusted: false,
            tags: [],
            favorites: ['proj2']
        },
        {
            username: 'supporter',
            password: 'password123',
            isAdmin: false,
            isTrusted: true,
            tags: ['TOP SUPPORTER'],
            favorites: []
        }
    ];
    
    // =================================================================
    //  2. APP INITIALIZATION & STATE MANAGEMENT
    // =================================================================

    // Use localStorage to persist data, otherwise use initial data
    let users = JSON.parse(localStorage.getItem('users')) || initialUsers;
    let surveyResponses = JSON.parse(localStorage.getItem('surveyResponses')) || [];
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    const saveUsers = () => localStorage.setItem('users', JSON.stringify(users));
    const saveSurveyResponses = () => localStorage.setItem('surveyResponses', JSON.stringify(surveyResponses));

    // DOM Elements
    const projectGrid = document.getElementById('project-grid');
    const surveyProjectOptions = document.getElementById('survey-project-options');
    
    // Login/UI Elements
    const loginPromptBtn = document.getElementById('login-prompt-btn');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    const adminPanel = document.getElementById('admin-panel');
    const chatWidgetBtn = document.getElementById('chat-widget-btn');
    const chatModal = document.getElementById('chat-modal');


    // =================================================================
    //  3. CORE FUNCTIONS
    // =================================================================

    // Renders all projects to the page
    function renderProjects() {
        projectGrid.innerHTML = '';
        projectsData.forEach(project => {
            const isFavorited = currentUser?.favorites.includes(project.id);
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
                <div class="project-footer">
                    <a href="#" class="cta-button">View Details</a>
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-project-id="${project.id}">
                        <i class="fas fa-star"></i>
                    </button>
                </div>
            `;
            projectGrid.appendChild(card);
        });
    }
    
    // Populates the survey with project titles
    function populateSurveyOptions() {
        surveyProjectOptions.innerHTML = '';
        projectsData.forEach((project, index) => {
             surveyProjectOptions.innerHTML += `
                <div class="radio-group">
                    <input type="radio" id="proj_opt_${index}" name="fav_project" value="${project.title}" required>
                    <label for="proj_opt_${index}">${project.title}</label>
                </div>
            `;
        });
    }

    // Updates the UI based on login status
    function updateUI() {
        if (currentUser) {
            // Logged in state
            loginPromptBtn.classList.add('hidden');
            userInfo.classList.remove('hidden');
            let tagsHTML = currentUser.tags.map(tag => `<span class="user-tag">${tag}</span>`).join(' ');
            usernameDisplay.innerHTML = `Welcome, ${currentUser.username} ${tagsHTML}`;
            
            // Show admin panel if admin
            if (currentUser.isAdmin) {
                adminPanel.classList.remove('hidden');
                renderAdminPanel();
            } else {
                adminPanel.classList.add('hidden');
            }
            // Show chat if trusted
            if (currentUser.isTrusted) {
                 chatWidgetBtn.classList.remove('hidden');
            } else {
                 chatWidgetBtn.classList.add('hidden');
            }

        } else {
            // Logged out state
            loginPromptBtn.classList.remove('hidden');
            userInfo.classList.add('hidden');
            adminPanel.classList.add('hidden');
            chatWidgetBtn.classList.add('hidden');
            usernameDisplay.textContent = '';
        }
        renderProjects(); // Re-render projects to update favorite status
    }
    
    // Admin Panel Rendering
    function renderAdminPanel() {
        // Render Survey Results
        const resultsContainer = document.getElementById('survey-results-container');
        resultsContainer.innerHTML = '<h4>No responses yet.</h4>';
        if (surveyResponses.length > 0) {
            resultsContainer.innerHTML = surveyResponses.map(res => 
                `<p><strong>${res.username}</strong> rated design <strong>${res.rating}/5</strong> and liked <strong>${res.project}</strong>.</p>`
            ).join('');
        }
        
        // Render User Management
        const userContainer = document.getElementById('user-management-container');
        userContainer.innerHTML = users.map(user => `
            <div class="user-entry">
                <span>
                    <strong>${user.username}</strong> 
                    ${user.tags.map(tag => `<span class="user-tag">${tag}</span>`).join(' ')}
                    ${user.isTrusted ? '<span class="user-tag" style="background-color:#28a745;">TRUSTED</span>' : ''}
                </span>
                <div class="user-controls">
                    <select class="tag-select" data-username="${user.username}">
                        <option value="">Add Tag</option>
                        <option value="TOP SUPPORTER">TOP SUPPORTER</option>
                        <option value="Contributor">Contributor</option>
                    </select>
                    <button class="trust-toggle" data-username="${user.username}">Toggle Trust</button>
                </div>
            </div>
        `).join('');
    }
    
    // =================================================================
    //  4. EVENT HANDLERS
    // =================================================================

    // Modal Handling
    loginPromptBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
    loginModal.querySelector('.close-btn').addEventListener('click', () => loginModal.classList.add('hidden'));

    // Login Form Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const foundUser = users.find(u => u.username === username && u.password === password);

        if (foundUser) {
            currentUser = foundUser;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            loginModal.classList.add('hidden');
            loginForm.reset();
            loginError.textContent = '';
            updateUI();
        } else {
            loginError.textContent = 'Invalid username or password.';
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        sessionStorage.removeItem('currentUser');
        updateUI();
    });
    
    // Favorite Button Click
    projectGrid.addEventListener('click', (e) => {
        if (e.target.closest('.favorite-btn')) {
            if (!currentUser) {
                alert('Please login to favorite projects!');
                return;
            }
            const btn = e.target.closest('.favorite-btn');
            const projectId = btn.dataset.projectId;
            
            const userIndex = users.findIndex(u => u.username === currentUser.username);
            const userFavorites = users[userIndex].favorites;

            if (userFavorites.includes(projectId)) {
                // Unfavorite
                users[userIndex].favorites = userFavorites.filter(id => id !== projectId);
            } else {
                // Favorite
                users[userIndex].favorites.push(projectId);
            }
            currentUser.favorites = users[userIndex].favorites;
            saveUsers();
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUI();
        }
    });

    // Survey Submission
    document.getElementById('feedback-form').addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert('Please login to submit feedback.');
            return;
        }
        const formData = new FormData(e.target);
        const newResponse = {
            username: currentUser.username,
            project: formData.get('fav_project'),
            rating: formData.get('rating')
        };
        surveyResponses.push(newResponse);
        saveSurveyResponses();
        alert('Thank you for your feedback!');
        e.target.reset();
        if (currentUser.isAdmin) renderAdminPanel();
    });
    
    // Admin User Management
    document.getElementById('admin-panel').addEventListener('click', (e) => {
        const username = e.target.dataset.username;
        if (!username) return;

        const userIndex = users.findIndex(u => u.username === username);
        if (userIndex === -1) return;

        // Toggle Trust
        if (e.target.classList.contains('trust-toggle')) {
            users[userIndex].isTrusted = !users[userIndex].isTrusted;
        }
        
        saveUsers();
        renderAdminPanel();
    });

    document.getElementById('admin-panel').addEventListener('change', (e) => {
        const username = e.target.dataset.username;
        if (!username || !e.target.classList.contains('tag-select')) return;
        
        const tag = e.target.value;
        if (!tag) return;

        const userIndex = users.findIndex(u => u.username === username);
        if (userIndex !== -1 && !users[userIndex].tags.includes(tag)) {
            users[userIndex].tags.push(tag);
            saveUsers();
            renderAdminPanel();
        }
        e.target.value = ''; // Reset select
    });
    
    // Chat Modal
    chatWidgetBtn.addEventListener('click', () => chatModal.classList.remove('hidden'));
    chatModal.querySelector('.close-btn').addEventListener('click', () => chatModal.classList.add('hidden'));

    // =================================================================
    //  5. INITIAL PAGE LOAD
    // =================================================================
    
    populateSurveyOptions();
    updateUI();
});