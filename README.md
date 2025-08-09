# Alex Benny's Portfolio Website

## Overview
This repository contains the code for Alex Benny's personal portfolio website, showcasing projects, skills, and contact information.

## Structure
- `index.html`: The main frontend file containing all UI components
- `backend/`: Contains the server code for handling contact form submissions

## Backend Setup

The backend is responsible for handling contact form submissions and sending emails. Follow these steps to set it up:

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create or edit the `.env` file in the `backend` directory with the following variables:

```
# Email Configuration
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_TO=your_email@gmail.com

# Server Configuration
PORT=3000
```

**Important Notes for Gmail Users:**
- For `SMTP_USER`: Use your Gmail address
- For `SMTP_PASS`: You need to use an App Password, not your regular Gmail password
  - Go to [Google Account Security](https://myaccount.google.com/security)
  - Enable 2-Step Verification if not already enabled
  - Go to [App Passwords](https://myaccount.google.com/apppasswords)
  - Select "Mail" as the app and "Other" as the device (name it "Portfolio Website")
  - Copy the generated 16-character password
- For `EMAIL_TO`: This is where you'll receive the contact form submissions

### 3. Run the Backend

#### For Development
```bash
cd backend
npm run dev
```

#### For Production
```bash
cd backend
npm start
```

### 4. Update Frontend Configuration (if needed)

If you're deploying the backend to a different URL, update the `backendUrl` variable in `index.html` (around line 985):

```javascript
const backendUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'  // Local development
    : 'https://your-new-backend-url.com';  // Your deployed backend URL
```

## Troubleshooting

### Backend Not Working
1. Check if the `.env` file is properly configured with valid credentials
2. Ensure you're using an App Password for Gmail, not your regular password
3. Verify that the backend server is running (`npm run dev` or `npm start`)
4. Check the console logs for any error messages
5. If deployed, ensure the backend URL in `index.html` is correct

### Contact Form Not Sending Emails
1. Check the browser console for any error messages
2. Verify that all required fields (name, email, subject, message) are being submitted
3. Ensure the backend server is running and accessible
4. Check if Gmail's security settings are blocking the authentication

## License
All rights reserved. This code is not licensed for redistribution.