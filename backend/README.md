# Portfolio Website Backend

This is the backend server for Alex Benny's portfolio website. It handles contact form submissions and sends emails using Nodemailer.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables in `.env`:
     - `SMTP_USER`: Your email address (e.g., Gmail)
     - `SMTP_PASS`: Your email password or app password
     - `EMAIL_TO`: The email address where you want to receive contact form submissions
     - `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend origins

3. For Gmail users:
   - Enable 2-factor authentication
   - Generate an App Password:
     1. Go to your Google Account settings
     2. Security > 2-Step Verification > App passwords
     3. Generate a new app password for "Mail"
     4. Use this password as `SMTP_PASS`

## Development

Run the development server with hot reload:
```bash
npm run dev
```

## Production

Start the production server:
```bash
npm start
```

## API Endpoints

### POST /contact
Handles contact form submissions.

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Hello",
  "message": "This is a test message"
}
```

### GET /health
Health check endpoint. Returns `{ "status": "ok" }` if the server is running.

## Error Handling

The server includes:
- Input validation
- Email format validation
- Error logging
- Proper HTTP status codes
- CORS configuration
- Email configuration validation on startup 