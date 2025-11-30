# Appli Tracker - Application Management System

A comprehensive full-stack application to help software developers, students, and job seekers track and manage their job applications throughout the hiring process.

![Appli Tracker Demo](demo.mp4)

## Overview

Appli Tracker is a full-stack web application designed to help users organize their job search process. It allows users to keep track of job applications, interview rounds, salaries, and personal notes about each opportunity. The application also features AI-powered insights to help users improve their application strategy.

## Key Features

- **User Authentication**: Secure signup, login, and profile management with JWT
- **Job Application Management**: Add, edit, and delete job applications with detailed information
- **Interview Tracking**: Record multiple interview rounds for each job opportunity
- **Dashboard View**: Get a visual overview of all your job applications at a glance
- **Dark/Light Mode**: Choose your preferred UI theme for comfortable viewing
- **AI-Powered Insights**: Leverage Gemini AI to get suggestions and improvements for your job search
- **Review System**: Add personal notes and reflections about each job application
- **Responsive Design**: Works on desktop and mobile devices

## Who Is This For?

### Software Developers
- Track coding assessments and technical interviews
- Organize job applications across multiple companies
- Document technical requirements for each position
- Compare salary offers and benefits

### Students
- Track internship applications
- Organize applications by academic term
- Keep notes about company culture and learning opportunities
- Prepare for interviews with historical data

### Job Seekers
- Centralize all job application data in one place
- Monitor application status and progress
- Remember important details about each company
- Plan follow-ups and next steps efficiently

## Technology Stack

### Frontend
- React 19
- React Router 7
- Material UI 7
- Tailwind CSS 4
- Framer Motion
- Axios
- Google Generative AI (Gemini)

### Backend
- Node.js
- Express.js 5
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcrypt for password hashing
- Nodemailer (email support)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- pnpm or npm
- Google Gemini API key (optional, for AI features)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/ruperthjr/appli-tracker.git
cd appli-tracker
```

2. **Install dependencies:**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
pnpm install
```

3. **Set up environment variables:**

**Server** - Create `.env` in the `server` directory:

```bash
cp server/.env.example server/.env
```

Then edit `server/.env`:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=postgresql://appli_user:your_password@localhost:5432/appli_tracker
NODE_ENV=development

# Optional: Email configuration
ADMIN_EMAIL=your-email@gmail.com
ADMIN_EMAIL_PASSWORD=your-app-password

# Optional: AI features
GOOGLE_API_KEY=your_gemini_api_key
OPENROUTER_KEY=your_openrouter_key
```

**Client** - Create `.env` in the `client` directory:

```bash
cp client/.env.example client/.env
```

Then edit `client/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

4. **Set up the database:**

```bash
# Create PostgreSQL user and database
sudo -u postgres psql

# In psql prompt:
CREATE USER appli_user WITH PASSWORD 'your_password';
CREATE DATABASE appli_tracker OWNER appli_user;
GRANT ALL PRIVILEGES ON DATABASE appli_tracker TO appli_user;
\q
```

5. **Run database migrations:**

```bash
cd server
npm run migrate
```

6. **Start the application:**

```bash
# Start the server (from server directory)
cd server
npm start

# In a new terminal, start the client (from client directory)
cd client
pnpm run dev
```

7. **Open your browser and navigate to** `http://localhost:5173`

## Usage

1. Sign up for a new account or log in with existing credentials
2. Navigate to the dashboard to view all your job applications
3. Click the "+" button to add a new job application
4. Fill in the job details including title, company, location, and salary
5. Add interview rounds as they occur
6. Use the AI feature to get insights about your application (if configured)
7. Add personal reviews and notes about each appli opportunity
8. Toggle between dark and light mode as preferred

## Contributing

Contributions are welcome! Here's how you can contribute to the project:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Open a Pull Request

Please make sure to update tests as appropriate and follow the code style of the project.

## Development Roadmap

- [ ] Analytics Dashboard: Visual representations of application statistics
- [ ] Email Notifications: Reminders for follow-ups and upcoming interviews
- [ ] Resume Storage: Attach and manage different versions of resumes
- [ ] Calendar Integration: Sync interview schedules with Google Calendar
- [ ] Mobile App: Native mobile experience for on-the-go job tracking
- [ ] Export Data: Export applications to CSV/PDF
- [ ] Application Templates: Quick templates for common job types
- [ ] Company Research: Integrated company information lookup

## Troubleshooting

### Database Issues

If you encounter database connection errors:

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if needed
sudo systemctl start postgresql
```

### Migration Issues

If migrations fail:

```bash
# Reset database (WARNING: This will delete all data)
sudo -u postgres psql -d appli_tracker -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO appli_user;"

# Run migrations again
npm run migrate
```

### Port Already in Use

If port 3000 or 5173 is in use:

```bash
# Find and kill process on port 3000
sudo lsof -ti:3000 | xargs kill -9

# Find and kill process on port 5173
sudo lsof -ti:5173 | xargs kill -9
```


## Contact

For questions or support, please open an issue on GitHub or contact [ruperthnyagesoa@gmail.com](mailto:ruperthnyagesoa@gmail.com)
