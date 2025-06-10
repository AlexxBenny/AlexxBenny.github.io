require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            console.log('Request with no origin - allowing');
            return callback(null, true);
        }
        
        // Log the incoming origin for debugging
        console.log('Incoming request from origin:', origin);
        
        // Allow localhost and 127.0.0.1 origins during development
        if (origin.startsWith('http://localhost:') || 
            origin.startsWith('http://127.0.0.1:') ||
            origin === 'https://alexxbenny.github.io' ||
            origin === 'https://alexxbenny.github.io/') {
            console.log('Origin allowed:', origin);
            return callback(null, true);
        }
        
        // Check against allowed origins from env
        const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
            process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : [];
        
        if (allowedOrigins.includes(origin)) {
            console.log('Origin allowed from ALLOWED_ORIGINS:', origin);
            callback(null, true);
        } else {
            console.log('Origin blocked:', origin);
            console.log('Allowed origins:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['POST', 'GET', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Add a preflight handler for OPTIONS requests
app.options('*', cors(corsOptions));

// Add error logging middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
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