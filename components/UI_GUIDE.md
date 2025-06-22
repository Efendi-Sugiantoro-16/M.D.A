# MDA Admin Dashboard - User Guide

## 🚀 Quick Start

### Accessing the Dashboard
1. **Start the Server**: Run `npm start` in the backend directory
2. **Open Browser**: Navigate to `http://localhost:3000`
3. **Login**: Use default credentials:
   - **Email**: `admin@mda.com`
   - **Password**: `admin123`

### First Time Setup
```bash
# Install dependencies
npm install

# Create environment file
copy env.example .env

# Setup database
npm run create-tables

# Add sample data
npm run seed-ui

# Start server
npm start
```

## 📊 Dashboard Overview

### Main Dashboard
The dashboard provides a comprehensive overview of your MDA system:

- **Statistics Cards**: View key metrics at a glance
- **Projects Chart**: Visual representation of project status
- **Recent Activities**: Latest system updates and actions
- **Quick Navigation**: Fast access to all sections

### Key Metrics
- **Total Users**: Number of registered users
- **Active Projects**: Projects currently in progress
- **New Messages**: Unread contact form submissions
- **Total Services**: Available services in the system

## 👥 User Management

### Viewing Users
- Navigate to **Users** section in the sidebar
- View all users in a table format
- See user details: name, email, role, status, creation date

### User Roles
- **Admin**: Full system access
- **Manager**: Project and user management
- **Developer**: Technical project access
- **Designer**: Design-related projects
- **Client**: Limited access to own projects

### Adding New Users
1. Click **"Add User"** button
2. Fill in required information:
   - Username (unique)
   - Email address
   - Password
   - First and Last Name
   - Role selection
3. Click **"Save User"**

### Managing Users
- **Edit**: Click edit icon to modify user details
- **Delete**: Click delete icon to remove users
- **Status**: Toggle user active/inactive status

## 🛠️ Services Management

### Viewing Services
- Navigate to **Services** section
- View services in card layout
- See service details: name, price, duration, status

### Service Information
- **Name**: Service title
- **Slug**: URL-friendly identifier
- **Description**: Detailed service description
- **Price**: Service cost
- **Duration**: Estimated completion time
- **Features**: List of included features
- **Status**: Active/Inactive

### Adding New Services
1. Click **"Add Service"** button
2. Fill in service details:
   - Service name and slug
   - Description and short description
   - Icon class (Font Awesome)
   - Price and price type
   - Duration and features
3. Click **"Save Service"**

### Service Types
- **Fixed**: One-time payment
- **Hourly**: Per-hour billing
- **Monthly**: Recurring monthly payment
- **Custom**: Negotiated pricing

## 📊 Projects Management

### Project Overview
- View all projects in table format
- See project status, client, service, and progress
- Track project completion percentages

### Project Status
- **Pending**: Awaiting start
- **In Progress**: Currently being worked on
- **Review**: Under client review
- **Completed**: Finished successfully
- **Cancelled**: Project terminated

### Project Priority
- **Low**: Standard priority
- **Medium**: Normal priority
- **High**: Important project
- **Urgent**: Critical timeline

### Managing Projects
- **View Details**: Click project name for full details
- **Update Status**: Change project status
- **Track Progress**: Update completion percentage
- **Assign Team**: Assign developers/designers

## 📧 Contact Messages

### Message Inbox
- View all contact form submissions
- See message status and priority
- Track client information and requirements

### Message Status
- **New**: Unread messages
- **Read**: Messages reviewed
- **Replied**: Response sent
- **Closed**: Conversation completed

### Message Priority
- **Low**: Standard inquiry
- **Medium**: Important request
- **High**: Urgent matter

### Managing Messages
- **View**: Read full message details
- **Reply**: Send response to client
- **Update Status**: Mark as read/replied/closed
- **Assign**: Assign to team member

## ⭐ Testimonials Management

### Testimonial Gallery
- View all client testimonials
- See ratings and client information
- Manage featured testimonials

### Testimonial Details
- **Client Name**: Customer name
- **Position**: Job title
- **Company**: Business name
- **Rating**: 1-5 star rating
- **Testimonial**: Customer feedback
- **Featured**: Highlight on website

### Adding Testimonials
1. Click **"Add Testimonial"** button
2. Fill in client information
3. Add testimonial text and rating
4. Set featured status
5. Click **"Save Testimonial"**

### Managing Testimonials
- **Edit**: Modify testimonial details
- **Delete**: Remove testimonials
- **Feature**: Highlight important testimonials
- **Rating**: Display star ratings

## ⚙️ System Settings

### General Settings
- **Site Name**: Website title
- **Site Description**: Meta description
- **Contact Email**: Primary contact
- **Contact Phone**: Business phone
- **Contact Address**: Office location

### Social Media
- **Facebook**: Facebook page URL
- **Twitter**: Twitter profile URL
- **LinkedIn**: LinkedIn company page
- **Instagram**: Instagram profile

### System Configuration
- **Maintenance Mode**: Enable/disable site
- **Default Currency**: System currency
- **Timezone**: Server timezone

### Saving Settings
1. Modify settings in the form
2. Click **"Save Settings"** button
3. Settings are applied immediately

## 🔐 Security & Authentication

### Login Security
- **JWT Tokens**: Secure authentication
- **Session Management**: Automatic token refresh
- **Role-based Access**: Different permissions per role

### Password Security
- **Encrypted Storage**: Passwords are hashed
- **Strong Requirements**: Minimum security standards
- **Password Reset**: Secure reset functionality

### Access Control
- **Admin**: Full system access
- **Manager**: Limited administrative access
- **Staff**: Project-specific access
- **Client**: Own data only

## 📱 Responsive Design

### Desktop View
- Full sidebar navigation
- Complete feature access
- Large data tables
- Detailed forms

### Tablet View
- Collapsible sidebar
- Optimized layouts
- Touch-friendly buttons
- Responsive tables

### Mobile View
- Mobile-first design
- Swipe navigation
- Simplified interfaces
- Touch-optimized controls

## 🎨 Customization

### Branding
- **Colors**: Customizable color scheme
- **Logo**: Upload company logo
- **Favicon**: Custom browser icon
- **Theme**: Light/dark mode options

### Layout Options
- **Sidebar**: Collapsible navigation
- **Dashboard**: Customizable widgets
- **Tables**: Sortable columns
- **Cards**: Flexible layouts

## 🔧 Troubleshooting

### Common Issues

#### Login Problems
- **Check Credentials**: Verify email/password
- **Database Connection**: Ensure MySQL is running
- **Server Status**: Confirm backend is active

#### Data Not Loading
- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Verify API calls
- **Server Logs**: Check backend errors

#### UI Issues
- **Clear Cache**: Refresh browser cache
- **Check Console**: Look for error messages
- **Update Browser**: Use latest version

### Error Messages

#### "Database Connection Failed"
- Check MySQL service status
- Verify database credentials in .env
- Ensure database exists

#### "Authentication Failed"
- Verify login credentials
- Check JWT token validity
- Clear browser storage

#### "API Request Failed"
- Check server status
- Verify API endpoints
- Check network connectivity

## 📞 Support

### Getting Help
- **Documentation**: Check README files
- **API Docs**: Review endpoint documentation
- **Error Logs**: Check server logs
- **Community**: Contact development team

### Contact Information
- **Email**: support@mda.com
- **Phone**: +1 (555) 123-4567
- **Hours**: Monday-Friday, 9 AM - 6 PM

## 🔄 Updates & Maintenance

### Regular Maintenance
- **Database Backups**: Daily automated backups
- **Security Updates**: Regular security patches
- **Performance Monitoring**: System health checks
- **Log Rotation**: Manage log files

### System Updates
- **Backup First**: Always backup before updates
- **Test Environment**: Test changes before production
- **Rollback Plan**: Have recovery procedures ready
- **Documentation**: Update documentation

---

**MDA Admin Dashboard** - Empowering digital agencies with powerful administration tools.

*For technical support, please contact the development team.* 