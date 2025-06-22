const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT === '465',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Email templates
const emailTemplates = {
    'contact-notification': {
        subject: 'New Contact Form Submission - {{first_name}} {{last_name}}',
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> {{first_name}} {{last_name}}</p>
            <p><strong>Email:</strong> {{email}}</p>
            <p><strong>Phone:</strong> {{phone}}</p>
            <p><strong>Company:</strong> {{company}}</p>
            <p><strong>Subject:</strong> {{subject}}</p>
            <p><strong>Service Interest:</strong> {{service_interest}}</p>
            <p><strong>Budget Range:</strong> {{budget_range}}</p>
            <p><strong>Timeline:</strong> {{timeline}}</p>
            <hr>
            <h3>Message:</h3>
            <p>{{message}}</p>
            <hr>
            <p><small>Message ID: {{messageId}}</small></p>
        `
    },
    'contact-confirmation': {
        subject: 'Thank you for contacting MDA',
        html: `
            <h2>Thank you for contacting us!</h2>
            <p>Dear {{first_name}} {{last_name}},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>Here's a copy of your message:</p>
            <blockquote>{{message}}</blockquote>
            <p>Best regards,<br>The MDA Team</p>
        `
    },
    'contact-reply': {
        subject: 'Re: {{subject}}',
        html: `
            <h2>Response to your inquiry</h2>
            <p>Dear {{first_name}} {{last_name}},</p>
            <p>Thank you for contacting MDA. Here's our response to your inquiry:</p>
            <blockquote>{{reply_message}}</blockquote>
            <p>If you have any further questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>{{admin_name}}<br>MDA Team</p>
        `
    },
    'welcome': {
        subject: 'Welcome to MDA - Your account has been created',
        html: `
            <h2>Welcome to MDA!</h2>
            <p>Dear {{first_name}} {{last_name}},</p>
            <p>Thank you for registering with us. Your account has been successfully created.</p>
            <p>You can now log in to your account and explore our services.</p>
            <p>Best regards,<br>The MDA Team</p>
        `
    },
    'password-reset': {
        subject: 'Password Reset Request - MDA',
        html: `
            <h2>Password Reset Request</h2>
            <p>Dear {{first_name}} {{last_name}},</p>
            <p>We received a request to reset your password. Click the link below to reset it:</p>
            <p><a href="{{resetLink}}">Reset Password</a></p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
            <p>Best regards,<br>The MDA Team</p>
        `
    }
};

// Send email function
const sendEmail = async ({ to, subject, template, context, html, text }) => {
    try {
        const transporter = createTransporter();

        let emailSubject = subject;
        let emailHtml = html;
        let emailText = text;

        // Use template if provided
        if (template && emailTemplates[template]) {
            const templateData = emailTemplates[template];
            emailSubject = templateData.subject;
            emailHtml = templateData.html;

            // Replace template variables
            if (context) {
                Object.keys(context).forEach(key => {
                    const regex = new RegExp(`{{${key}}}`, 'g');
                    emailSubject = emailSubject.replace(regex, context[key]);
                    emailHtml = emailHtml.replace(regex, context[key]);
                });
            }
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: to,
            subject: emailSubject,
            html: emailHtml,
            text: emailText || emailHtml.replace(/<[^>]*>/g, '') // Strip HTML for text version
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Send bulk email function
const sendBulkEmail = async (recipients, { subject, template, context, html, text }) => {
    const results = [];
    
    for (const recipient of recipients) {
        const result = await sendEmail({
            to: recipient.email,
            subject,
            template,
            context: { ...context, ...recipient },
            html,
            text
        });
        results.push({ email: recipient.email, ...result });
    }
    
    return results;
};

// Test email configuration
const testEmailConfig = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('Email configuration is valid');
        return { success: true };
    } catch (error) {
        console.error('Email configuration test failed:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendEmail,
    sendBulkEmail,
    testEmailConfig,
    emailTemplates
}; 