// MDA Admin Dashboard JavaScript

class AdminDashboard {
    constructor() {
        this.apiBase = '/api';
        this.currentUser = null;
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuth();
        this.loadDashboard();
    }

    setupEventListeners() {
        // Sidebar toggle
        document.getElementById('sidebarCollapse').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
            document.getElementById('content').classList.toggle('active');
        });

        // Navigation
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(link.dataset.section);
            });
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Form submissions
        document.getElementById('saveUserBtn').addEventListener('click', () => this.saveUser());
        document.getElementById('saveServiceBtn').addEventListener('click', () => this.saveService());
        document.getElementById('settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });

        // Modal events
        document.getElementById('addUserModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('addUserForm').reset();
        });

        document.getElementById('addServiceModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('addServiceForm').reset();
        });
    }

    async checkAuth() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                window.location.href = '/login.html';
                return;
            }

            const response = await this.apiCall('/auth/me', 'GET', null, token);
            if (response.success) {
                this.currentUser = response.data;
                document.getElementById('currentUser').textContent = this.currentUser.first_name;
            } else {
                localStorage.removeItem('authToken');
                window.location.href = '/login.html';
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('authToken');
            window.location.href = '/login.html';
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        window.location.href = '/login.html';
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav items
        document.querySelectorAll('#sidebar li').forEach(li => {
            li.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to nav item
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.parentElement.classList.add('active');
        }

        // Load section data
        this.loadSectionData(sectionName);
    }

    async loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'users':
                await this.loadUsers();
                break;
            case 'services':
                await this.loadServices();
                break;
            case 'projects':
                await this.loadProjects();
                break;
            case 'contact':
                await this.loadContactMessages();
                break;
            case 'testimonials':
                await this.loadTestimonials();
                break;
            case 'settings':
                await this.loadSettings();
                break;
        }
    }

    async loadDashboard() {
        await this.loadDashboardData();
    }

    async loadDashboardData() {
        try {
            const response = await this.apiCall('/dashboard/overview', 'GET');
            if (response.success) {
                this.updateDashboardStats(response.data);
                this.createProjectsChart(response.data.projectsByStatus);
                this.loadRecentActivities();
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    updateDashboardStats(data) {
        document.getElementById('totalUsers').textContent = data.totalUsers || 0;
        document.getElementById('activeProjects').textContent = data.activeProjects || 0;
        document.getElementById('newMessages').textContent = data.newMessages || 0;
        document.getElementById('totalServices').textContent = data.totalServices || 0;
    }

    createProjectsChart(projectsData) {
        const ctx = document.getElementById('projectsChart');
        if (!ctx) return;

        if (this.charts.projects) {
            this.charts.projects.destroy();
        }

        this.charts.projects = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(projectsData),
                datasets: [{
                    data: Object.values(projectsData),
                    backgroundColor: [
                        '#4e73df',
                        '#1cc88a',
                        '#f6c23e',
                        '#e74a3b',
                        '#858796'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    async loadRecentActivities() {
        try {
            const response = await this.apiCall('/dashboard/recent-activities', 'GET');
            if (response.success) {
                const container = document.getElementById('recentActivities');
                container.innerHTML = response.data.map(activity => `
                    <div class="d-flex align-items-center mb-3">
                        <div class="flex-shrink-0">
                            <i class="fas fa-circle text-primary" style="font-size: 0.5rem;"></i>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <div class="small text-gray-600">${activity.action}</div>
                            <div class="small text-gray-500">${new Date(activity.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Failed to load recent activities:', error);
        }
    }

    async loadUsers() {
        try {
            const response = await this.apiCall('/users', 'GET');
            if (response.success) {
                this.renderUsersTable(response.data);
            }
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    }

    renderUsersTable(users) {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.first_name} ${user.last_name}</td>
                <td>${user.email}</td>
                <td><span class="badge bg-primary">${user.role}</span></td>
                <td>
                    <span class="badge ${user.is_active ? 'bg-success' : 'bg-danger'}">
                        ${user.is_active ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="admin.editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="admin.deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async loadServices() {
        try {
            const response = await this.apiCall('/services', 'GET');
            if (response.success) {
                this.renderServicesGrid(response.data);
            }
        } catch (error) {
            console.error('Failed to load services:', error);
        }
    }

    renderServicesGrid(services) {
        const container = document.getElementById('servicesGrid');
        container.innerHTML = services.map(service => `
            <div class="col-md-6 col-lg-4">
                <div class="service-card">
                    <div class="card-body">
                        <div class="service-icon">
                            <i class="${service.icon || 'fas fa-cog'}"></i>
                        </div>
                        <div class="service-title">${service.name}</div>
                        <div class="service-price">$${service.price}</div>
                        <div class="service-duration">${service.duration}</div>
                        <p class="text-muted">${service.short_description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge ${service.is_active ? 'bg-success' : 'bg-secondary'}">
                                ${service.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <div>
                                <button class="btn btn-sm btn-outline-primary" onclick="admin.editService(${service.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="admin.deleteService(${service.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadProjects() {
        try {
            const response = await this.apiCall('/projects', 'GET');
            if (response.success) {
                this.renderProjectsTable(response.data);
            }
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    }

    renderProjectsTable(projects) {
        const tbody = document.querySelector('#projectsTable tbody');
        tbody.innerHTML = projects.map(project => `
            <tr>
                <td>${project.id}</td>
                <td>${project.title}</td>
                <td>${project.client_name || 'N/A'}</td>
                <td>${project.service_name || 'N/A'}</td>
                <td>
                    <span class="badge bg-${this.getStatusColor(project.status)}">
                        ${project.status.replace('_', ' ')}
                    </span>
                </td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar" style="width: ${project.progress}%">${project.progress}%</div>
                    </div>
                </td>
                <td>${new Date(project.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="admin.editProject(${project.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="admin.deleteProject(${project.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async loadContactMessages() {
        try {
            const response = await this.apiCall('/contact', 'GET');
            if (response.success) {
                this.renderContactTable(response.data);
            }
        } catch (error) {
            console.error('Failed to load contact messages:', error);
        }
    }

    renderContactTable(messages) {
        const tbody = document.querySelector('#contactTable tbody');
        tbody.innerHTML = messages.map(message => `
            <tr>
                <td>${message.id}</td>
                <td>${message.first_name} ${message.last_name}</td>
                <td>${message.email}</td>
                <td>${message.subject || 'No subject'}</td>
                <td>
                    <span class="badge bg-${this.getStatusColor(message.status)}">
                        ${message.status}
                    </span>
                </td>
                <td>${new Date(message.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="admin.viewMessage(${message.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="admin.replyMessage(${message.id})">
                        <i class="fas fa-reply"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async loadTestimonials() {
        try {
            const response = await this.apiCall('/testimonials', 'GET');
            if (response.success) {
                this.renderTestimonialsGrid(response.data);
            }
        } catch (error) {
            console.error('Failed to load testimonials:', error);
        }
    }

    renderTestimonialsGrid(testimonials) {
        const container = document.getElementById('testimonialsGrid');
        container.innerHTML = testimonials.map(testimonial => `
            <div class="col-md-6 col-lg-4">
                <div class="testimonial-card">
                    <div class="rating">
                        ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                    </div>
                    <div class="testimonial-text">"${testimonial.testimonial}"</div>
                    <div class="client-info">
                        <div class="client-name">${testimonial.client_name}</div>
                        <div class="client-position">${testimonial.client_position} at ${testimonial.client_company}</div>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-sm btn-outline-primary" onclick="admin.editTestimonial(${testimonial.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="admin.deleteTestimonial(${testimonial.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadSettings() {
        try {
            const response = await this.apiCall('/settings', 'GET');
            if (response.success) {
                this.populateSettingsForm(response.data);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    populateSettingsForm(settings) {
        settings.forEach(setting => {
            const element = document.getElementById(setting.setting_key);
            if (element) {
                element.value = setting.setting_value;
            }
        });
    }

    async saveUser() {
        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            first_name: document.getElementById('firstName').value,
            last_name: document.getElementById('lastName').value,
            role: document.getElementById('role').value
        };

        try {
            const response = await this.apiCall('/users', 'POST', formData);
            if (response.success) {
                this.showAlert('User created successfully!', 'success');
                bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
                this.loadUsers();
            } else {
                this.showAlert('Failed to create user: ' + response.message, 'danger');
            }
        } catch (error) {
            this.showAlert('Failed to create user: ' + error.message, 'danger');
        }
    }

    async saveService() {
        const formData = {
            name: document.getElementById('serviceName').value,
            slug: document.getElementById('serviceSlug').value,
            description: document.getElementById('serviceDescription').value,
            icon: document.getElementById('serviceIcon').value,
            price: parseFloat(document.getElementById('servicePrice').value),
            price_type: document.getElementById('serviceType').value,
            duration: document.getElementById('serviceDuration').value
        };

        try {
            const response = await this.apiCall('/services', 'POST', formData);
            if (response.success) {
                this.showAlert('Service created successfully!', 'success');
                bootstrap.Modal.getInstance(document.getElementById('addServiceModal')).hide();
                this.loadServices();
            } else {
                this.showAlert('Failed to create service: ' + response.message, 'danger');
            }
        } catch (error) {
            this.showAlert('Failed to create service: ' + error.message, 'danger');
        }
    }

    async saveSettings() {
        const formData = new FormData(document.getElementById('settingsForm'));
        const settings = {};
        
        for (let [key, value] of formData.entries()) {
            settings[key] = value;
        }

        try {
            const response = await this.apiCall('/settings', 'PUT', settings);
            if (response.success) {
                this.showAlert('Settings saved successfully!', 'success');
            } else {
                this.showAlert('Failed to save settings: ' + response.message, 'danger');
            }
        } catch (error) {
            this.showAlert('Failed to save settings: ' + error.message, 'danger');
        }
    }

    getStatusColor(status) {
        const colors = {
            'active': 'success',
            'inactive': 'secondary',
            'pending': 'warning',
            'in_progress': 'info',
            'completed': 'success',
            'cancelled': 'danger',
            'new': 'primary',
            'read': 'info',
            'replied': 'success',
            'closed': 'secondary'
        };
        return colors[status] || 'secondary';
    }

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    async apiCall(endpoint, method = 'GET', data = null, token = null) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            const storedToken = localStorage.getItem('authToken');
            if (storedToken) {
                headers['Authorization'] = `Bearer ${storedToken}`;
            }
        }

        const options = {
            method,
            headers,
            credentials: 'same-origin'
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(this.apiBase + endpoint, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'API request failed');
            }

            return result;
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // Placeholder methods for edit/delete operations
    editUser(id) {
        this.showAlert('Edit user functionality coming soon!', 'info');
    }

    deleteUser(id) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.showAlert('Delete user functionality coming soon!', 'info');
        }
    }

    editService(id) {
        this.showAlert('Edit service functionality coming soon!', 'info');
    }

    deleteService(id) {
        if (confirm('Are you sure you want to delete this service?')) {
            this.showAlert('Delete service functionality coming soon!', 'info');
        }
    }

    editProject(id) {
        this.showAlert('Edit project functionality coming soon!', 'info');
    }

    deleteProject(id) {
        if (confirm('Are you sure you want to delete this project?')) {
            this.showAlert('Delete project functionality coming soon!', 'info');
        }
    }

    viewMessage(id) {
        this.showAlert('View message functionality coming soon!', 'info');
    }

    replyMessage(id) {
        this.showAlert('Reply message functionality coming soon!', 'info');
    }

    editTestimonial(id) {
        this.showAlert('Edit testimonial functionality coming soon!', 'info');
    }

    deleteTestimonial(id) {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            this.showAlert('Delete testimonial functionality coming soon!', 'info');
        }
    }
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new AdminDashboard();
}); 