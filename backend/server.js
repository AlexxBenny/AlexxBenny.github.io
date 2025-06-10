require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
app.use((req, res, next) => {
    const allowedOrigins = [
        'https://alexxbenny.github.io',
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ];
    
    const origin = req.headers.origin;
    console.log('Request headers:', req.headers);
    console.log('Request origin:', origin);
    console.log('Request method:', req.method);
    console.log('Request path:', req.path);
    
    // Always allow requests from GitHub Pages
    if (origin === 'https://alexxbenny.github.io') {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        console.log('Allowed GitHub Pages request');
    }
    // Allow requests with no origin (like direct API calls)
    else if (!origin) {
        console.log('Request with no origin - allowing');
        // Don't set CORS headers for requests with no origin
    }
    // Allow local development
    else if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        console.log('Allowed local development request');
    }
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        console.log('Handling preflight request');
        res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
        return res.status(204).end();
    }
    
    next();
});

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify email configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log('Email configuration error:', error);
    } else {
        console.log('Email configuration is valid');
    }
});

// Contact form endpoint
app.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Prepare email content
        const mailOptions = {
            from: `"${name}" <${process.env.SMTP_USER}>`,
            to: process.env.EMAIL_TO,
            replyTo: email,
            subject: `Contact Form: ${subject}`,
            text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
            `,
            html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Subject:</strong> ${subject}</p>
<h3>Message:</h3>
<p>${message.replace(/\n/g, '<br>')}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            error: 'Failed to send message. Please try again later.'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await transporter.verify();
}); 