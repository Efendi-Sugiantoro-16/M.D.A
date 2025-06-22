# MDA Admin Dashboard UI

Modern Digital Agency Admin Dashboard - A comprehensive web-based administration interface for managing the MDA website.

## Features

### 🎯 Dashboard Overview
- **Real-time Statistics**: View total users, active projects, new messages, and services
- **Interactive Charts**: Visual representation of project status distribution
- **Recent Activities**: Track latest system activities and updates
- **Quick Actions**: Fast access to common administrative tasks

### 👥 User Management
- **User List**: View all registered users with detailed information
- **Role Management**: Assign and manage user roles (admin, manager, developer, designer, client)
- **User Status**: Activate/deactivate user accounts
- **Add New Users**: Create new user accounts with role assignment

### 🛠️ Services Management
- **Service Catalog**: Manage all available services
- **Service Details**: Configure pricing, duration, features, and descriptions
- **Service Status**: Activate/deactivate services
- **Featured Services**: Highlight important services

### 📊 Projects Management
- **Project Overview**: Track all projects and their current status
- **Project Details**: View client information, service type, and progress
- **Status Updates**: Update project status (pending, in progress, review, completed, cancelled)
- **Progress Tracking**: Monitor project completion percentages

### 📧 Contact Messages
- **Message Inbox**: View all incoming contact form submissions
- **Message Status**: Track message status (new, read, replied, closed)
- **Quick Actions**: Reply to messages and update status
- **Client Information**: View detailed client contact information

### ⭐ Testimonials Management
- **Testimonial Gallery**: Manage client testimonials and reviews
- **Rating System**: Display and manage 5-star ratings
- **Featured Testimonials**: Highlight important client feedback
- **Client Information**: Store client details and company information

### ⚙️ System Settings
- **General Settings**: Configure site name, description, and contact information
- **Social Media**: Manage social media links and profiles
- **Contact Information**: Update phone, email, and address details
- **System Configuration**: Control maintenance mode and other system settings

## Technology Stack

### Frontend
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Interactive functionality and API integration
- **Bootstrap 5**: Responsive UI framework
- **Chart.js**: Data visualization and charts
- **Font Awesome**: Icon library

### Backend Integration
- **RESTful API**: Full integration with MDA backend
- **JWT Authentication**: Secure login and session management
- **Real-time Updates**: Live data synchronization
- **Error Handling**: Comprehensive error management

## Installation & Setup

### Prerequisites
- Node.js backend server running
- MySQL database configured
- Modern web browser

### Quick Start
1. **Start Backend Server**:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Access Admin Dashboard**:
   - Open browser and navigate to: `http://localhost:3000`
   - Login with default credentials:
     - Email: `admin@mda.com`
     - Password: `admin123`

3. **Database Setup** (if not already done):
   ```bash
   npm run migrate
   npm run seed
   ```

## Usage Guide

### 🔐 Authentication
- **Login**: Use admin credentials to access the dashboard
- **Session Management**: Automatic token refresh and session handling
- **Logout**: Secure logout with token cleanup

### 📱 Responsive Design
- **Desktop**: Full-featured dashboard with sidebar navigation
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Collapsible sidebar and touch-friendly interface

### 🎨 User Interface
- **Modern Design**: Clean, professional interface
- **Color Scheme**: Consistent branding with MDA colors
- **Typography**: Readable fonts and proper hierarchy
- **Icons**: Intuitive iconography throughout the interface

### 📊 Data Management
- **Real-time Updates**: Live data synchronization
- **Search & Filter**: Find specific records quickly
- **Bulk Operations**: Perform actions on multiple items
- **Export Options**: Download data in various formats

## API Endpoints

The admin UI integrates with the following backend endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Dashboard
- `GET /api/dashboard/overview` - Dashboard statistics
- `GET /api/dashboard/recent-activities` - Recent activities

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Services
- `GET /api/services` - List all services
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Contact Messages
- `GET /api/contact` - List all messages
- `PUT /api/contact/:id` - Update message status

### Testimonials
- `GET /api/testimonials` - List all testimonials
- `POST /api/testimonials` - Create new testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial

### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update settings

## Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: Different permissions for different user roles
- **Session Management**: Automatic token refresh and validation
- **Secure Logout**: Proper token cleanup on logout

### Data Protection
- **HTTPS Ready**: Configured for secure connections
- **Input Validation**: Client and server-side validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content Security Policy headers

### Error Handling
- **Graceful Degradation**: UI remains functional on errors
- **User-friendly Messages**: Clear error messages for users
- **Logging**: Comprehensive error logging for debugging

## Customization

### Styling
- **CSS Variables**: Easy color scheme customization
- **Modular CSS**: Organized stylesheets for easy maintenance
- **Responsive Breakpoints**: Customizable responsive design

### Functionality
- **Modular JavaScript**: Easy to extend and modify
- **API Integration**: Simple to add new API endpoints
- **Component-based**: Reusable UI components

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Performance

- **Optimized Assets**: Minified CSS and JavaScript
- **Lazy Loading**: Images and components load on demand
- **Caching**: Browser caching for static assets
- **Compression**: Gzip compression for faster loading

## Troubleshooting

### Common Issues

1. **Login Fails**:
   - Check if backend server is running
   - Verify database connection
   - Ensure default admin user exists

2. **Data Not Loading**:
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check network connectivity

3. **UI Not Responsive**:
   - Clear browser cache
   - Check for JavaScript errors
   - Verify all assets are loading

### Debug Mode
Enable debug mode by setting `NODE_ENV=development` in your environment variables.

## Contributing

1. Follow the existing code style
2. Add comments for complex logic
3. Test thoroughly before submitting
4. Update documentation for new features

## License

This project is part of the MDA (Modern Digital Agency) system.

## Support

For technical support or questions:
- Check the main README.md file
- Review API documentation
- Contact the development team

---

**MDA Admin Dashboard** - Empowering digital agencies with powerful administration tools. 