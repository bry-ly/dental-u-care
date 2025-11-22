# Dental U Care - Dental Clinic Management System

A comprehensive, modern dental clinic appointment booking and management system built with Next.js 15, featuring role-based access control for Patients, Dentists, and Administrators. This system streamlines appointment scheduling, patient management, and dental practice administration with a beautiful, responsive user interface.

## 🎯 Overview

This dental management system provides a complete solution for managing appointments, patient records, dentist schedules, and administrative tasks. The system supports three distinct user roles, each with tailored dashboards and functionalities to meet their specific needs.

### Key Highlights

- **Multi-Role System**: Separate dashboards for Patients, Dentists, and Administrators
- **Secure Authentication**: Email/Password and Google OAuth with Better Auth
- **Real-time Notifications**: Email notifications for appointments, reminders, and updates
- **Responsive Design**: Modern UI built with TailwindCSS and Radix UI components
- **Type-Safe**: Full TypeScript implementation with Zod validation
- **Database-Driven**: MongoDB with Prisma ORM for robust data management
- **Payment Integration**: Stripe payment processing for services

## ✨ Features

### 👤 Patient Features

- **Appointment Booking**: Browse available dentists, view schedules, and book appointments
- **Appointment Management**: View, reschedule, or cancel appointments
- **Dentist Discovery**: Search and filter dentists by specialization
- **Health Records**: Access personal dental health records and treatment history
- **Payment Management**: View payment history and make payments for services
- **Notifications**: Receive email notifications for appointment confirmations, reminders, and updates
- **Profile Settings**: Update personal information, contact details, and preferences

### 🦷 Dentist Features

- **Dashboard Overview**: View today's schedule and upcoming appointments at a glance
- **Schedule Management**: Set and manage working hours and availability
- **Patient Management**: View patient list, access patient records, and treatment history
- **Appointment Handling**: Confirm, reschedule, or cancel appointments
- **Patient Records**: Access and update patient dental records and treatment plans
- **Notifications**: Receive notifications for new bookings and appointment changes
- **Profile Settings**: Manage professional profile, specialization, and qualifications

### 👨‍💼 Administrator Features

- **Dashboard Overview**: Comprehensive system statistics, analytics, and key metrics
- **User Management**: Create, update, and manage user accounts (Patients, Dentists, Staff)
- **Appointment Management**: View and manage all appointments across the system
- **Dentist Management**: Manage dentist profiles, specializations, qualifications, and availability
- **Patient Management**: View and manage patient accounts, records, and treatment history
- **Service Management**: Configure dental services, pricing, and service categories
- **System Analytics**: View appointment statistics, revenue reports, and system usage
- **Settings**: Configure system-wide settings, notifications, and preferences

## 🛠️ Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Shadcn/ui](https://ui.shadcn.com/)** - High-quality component library
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation
- **[Motion](https://motion.dev/)** - Animation library
- **[Recharts](https://recharts.org/)** - Chart library for analytics
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon library

### Backend & Infrastructure

- **Next.js API Routes** - Server-side API endpoints
- **[Better Auth](https://better-auth.com/)** - Authentication and session management
- **[Prisma](https://www.prisma.io/)** - Type-safe database ORM
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Stripe](https://stripe.com/)** - Payment processing
- **[Resend](https://resend.com/)** - Email service for notifications

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Turbopack** - Fast bundler for development
- **Prisma Studio** - Database management GUI

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **MongoDB** database (local or MongoDB Atlas)
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/dental-u-care.git
cd dental-u-care
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables Setup

Create a `.env` file in the root directory and add the following variables:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (MongoDB)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/dental_u_care?retryWrites=true&w=majority"

# Better Auth Configuration
BETTER_AUTH_SECRET="your_generated_secret_key_here"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Email Service (Resend)
RESEND_API_KEY="your_resend_api_key"
EMAIL_SENDER_NAME="Dental U Care"
EMAIL_SENDER_ADDRESS="send@dentalucare.tech"

# Stripe Payment (Optional)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
NEXT_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
```

**Note**: You can copy `.env.example` as a template:

```bash
cp .env.example .env
```

### 4. Database Setup

Generate Prisma Client and push schema to database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to MongoDB
npx prisma db push

# (Optional) Seed the database with initial data
npm run prisma:seed
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
dental-u-care/
├── app/                        # Next.js App Router
│   ├── (auth)/                # Authentication pages
│   │   ├── sign-in/          # Sign in page
│   │   ├── sign-up/          # Sign up page
│   │   ├── forgot-password/  # Forgot password
│   │   └── reset-password/   # Reset password
│   ├── (main)/               # Main application layout
│   │   └── dashboard/        # Protected dashboards
│   │       ├── patient/      # Patient dashboard
│   │       │   ├── appointments/
│   │       │   ├── book-appointment/
│   │       │   ├── health-records/
│   │       │   ├── payments/
│   │       │   └── settings/
│   │       ├── dentist/      # Dentist dashboard
│   │       │   ├── appointments/
│   │       │   ├── patients/
│   │       │   ├── schedule/
│   │       │   └── settings/
│   │       └── admin/        # Admin dashboard
│   │           ├── appointment-management/
│   │           ├── dentist-management/
│   │           ├── patient-management/
│   │           ├── service-management/
│   │           ├── user-management/
│   │           └── settings/
│   ├── api/                  # API routes
│   │   ├── admin/           # Admin API endpoints
│   │   ├── appointments/    # Appointment API
│   │   ├── auth/            # Authentication API
│   │   └── users/           # User API
│   ├── docs/                # Documentation pages
│   ├── services/            # Public services pages
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── admin/              # Admin components
│   ├── dentist/            # Dentist components
│   ├── patient/            # Patient components
│   ├── emails/             # Email templates
│   ├── forms/              # Form components
│   ├── landing/            # Landing page components
│   ├── layout/             # Layout components
│   └── ui/                 # UI components (Shadcn)
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions and configurations
│   ├── actions/            # Server actions
│   ├── auth-session/       # Authentication configuration
│   ├── email/              # Email service
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── validations/        # Zod validation schemas
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma       # Prisma schema
│   └── seed.ts             # Database seeding
├── public/                  # Static assets
├── middleware.ts            # Next.js middleware (route protection)
└── package.json            # Dependencies and scripts
```

## 🔐 Authentication

The system uses **Better Auth** with multiple authentication methods:

### Authentication Methods

1. **Email & Password**: Traditional email/password authentication with email verification
2. **Google OAuth**: Sign in with Google account for quick access
3. **Email Verification**: Required email verification for new accounts
4. **Password Reset**: Secure password reset flow with email verification

### Security Features

- **Email Verification**: OTP-based email verification for new accounts
- **Session Management**: Secure session handling with 30-day expiration
- **Cookie Security**: HTTP-only, secure cookies in production
- **Role-Based Access**: Automatic routing based on user role (patient, dentist, admin)
- **CSRF Protection**: Cross-site request forgery protection

### Authentication Flow

1. **Sign Up**: Users register with name, email, and password
2. **Email Verification**: Verification email sent with confirmation link
3. **Sign In**: Users sign in with verified email/password or Google account
4. **Role Assignment**: Default role is "patient" (can be changed by admin)
5. **Dashboard Redirect**: Automatic redirect to role-specific dashboard

## 📊 Database Schema

The system uses MongoDB with the following main models:

### Core Models

- **User**: User accounts with roles (patient, dentist, admin)
  - Personal information (name, email, phone, address, dateOfBirth)
  - Medical history and records
  - Role-specific fields (specialization for dentists)
  - Stripe customer ID for payments

- **Service**: Dental services offered by the clinic
  - Service name, description, and category
  - Duration and pricing information
  - Active/inactive status

- **Appointment**: Appointment bookings
  - Patient, dentist, and service references
  - Date, time slot, and status (pending, confirmed, cancelled, completed, rescheduled)
  - Notes and cancellation reasons

- **Payment**: Payment transactions
  - Appointment reference
  - Amount, method, and status
  - Stripe integration fields

- **Notification**: System notifications
  - User-specific notifications
  - Email, SMS, or push notification types
  - Read/unread status

- **ChatMessage**: Patient-staff communication
  - User messages and responses
  - Timestamp tracking

### Authentication Models

- **Session**: User session management
- **Account**: OAuth account information
- **Verification**: Email verification tokens

## 🎨 UI Components

The system uses a comprehensive set of UI components:

### Component Library

- **Forms**: Input, Textarea, Select, Checkbox, Radio, Switch
- **Data Display**: Tables, Cards, Badges, Avatars
- **Navigation**: Sidebar, Navbar, Breadcrumbs, Tabs
- **Feedback**: Alerts, Toasts, Dialogs, Modals
- **Charts**: Line, Bar, Pie charts for analytics
- **Calendar**: Date picker and appointment calendar

### Design Features

- **Theme Switcher**: Light/Dark mode support
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA-compliant components
- **Animations**: Smooth transitions and micro-interactions

## 📧 Email Notifications

The system sends automated email notifications using **Resend**:

### Email Types

1. **Email Verification**: Sent when users sign up
2. **Password Reset**: Sent when users request password reset
3. **Appointment Confirmation**: Sent when appointments are booked
4. **Appointment Reminder**: Sent before scheduled appointments
5. **Appointment Cancellation**: Sent when appointments are cancelled

### Email Configuration

Configure your email service in `.env`:

```env
RESEND_API_KEY="your_resend_api_key"
EMAIL_SENDER_NAME="Dental U Care"
EMAIL_SENDER_ADDRESS="send@dentalucare.tech"
```

## 💳 Payment Integration

The system integrates with **Stripe** for payment processing:

- **Service Payments**: Patients can pay for dental services
- **Payment History**: View past transactions
- **Secure Processing**: PCI-compliant payment handling
- **Multiple Payment Methods**: Card, e-wallet, bank transfer, cash

## 🧪 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Database
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema to MongoDB
npx prisma studio        # Open Prisma Studio (database GUI)
npm run prisma:seed      # Seed database with initial data

# Post-install
npm run postinstall      # Auto-run after npm install (generates Prisma Client)
```

## 🎯 Demo Instructions

### For Clients/Classmates

#### 1. Start the Application

```bash
npm run dev
```

#### 2. Access the Application

- Open http://localhost:3000
- You'll see the landing page with features, services, and pricing

#### 3. Create Test Accounts

**Patient Account:**

1. Click "Sign Up" or "Get Started"
2. Register with email and password
3. Verify email (check your inbox or development console)
4. You'll be redirected to the patient dashboard

**Dentist Account:**

1. Sign up as normal user
2. Admin needs to upgrade your role to "dentist"
3. Access dentist dashboard with extended features

**Admin Account:**

1. Sign up as normal user
2. Manually update role in database to "admin"
3. Access full admin dashboard

#### 4. Explore Key Features

**Patient Experience:**

1. **Browse Services**: View available dental services and pricing
2. **Book Appointment**:
   - Select a service
   - Choose a dentist
   - Pick available date/time
   - Confirm booking
3. **View Appointments**: Check upcoming and past appointments
4. **Health Records**: Access dental records and treatment history
5. **Make Payments**: View payment history and make payments

**Dentist Experience:**

1. **Dashboard**: View today's appointments and statistics
2. **Schedule**: Manage working hours and availability
3. **Patients**: View patient list and records
4. **Appointments**: Manage appointment requests

**Admin Experience:**

1. **Dashboard**: System-wide statistics and analytics
2. **User Management**: Manage all users (patients, dentists, staff)
3. **Appointment Oversight**: View and manage all appointments
4. **Dentist Management**: Add/edit dentist profiles and specializations
5. **Service Management**: Configure services, pricing, categories
6. **System Settings**: Configure system-wide preferences

#### 5. Key Features to Highlight

- ✨ **Responsive Design**: Try on mobile, tablet, and desktop
- 🌙 **Dark/Light Theme**: Toggle theme in settings
- 📧 **Email Notifications**: Real-time appointment notifications
- 📅 **Interactive Calendar**: Visual appointment booking
- 📊 **Analytics Dashboard**: Charts and statistics (admin/dentist)
- 💳 **Payment Processing**: Stripe integration for payments
- 🔐 **Secure Authentication**: Email verification and OAuth

### Creating Test Data

You can create test data in several ways:

1. **Through the UI**: Use the application normally
2. **Prisma Studio**: Visual database editor
   ```bash
   npx prisma studio
   ```
3. **Seed Script**: Run the seed script
   ```bash
   npm run prisma:seed
   ```

## 🔒 Security Features

- **Email Verification**: Required for account activation
- **Secure Sessions**: HTTP-only cookies with 30-day expiration
- **Role-Based Access Control**: Middleware protection for routes
- **Input Validation**: Zod schema validation for all inputs
- **SQL Injection Protection**: Prisma ORM prevents injection attacks
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Cookies**: Production cookies are secure and HTTP-only
- **OAuth 2.0**: Google authentication for additional security

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/[...all]` - Better Auth endpoints (sign-in, sign-up, sign-out)

### Appointments

- `GET /api/appointments` - Get appointments
- `POST /api/appointments/book` - Create appointment
- `PATCH /api/appointments/[id]` - Update appointment

### Users

- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/account` - Update account
- `PATCH /api/users/settings` - Update settings

### Admin

- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PATCH /api/admin/users/[id]` - Update user
- `GET /api/admin/dentists` - Get all dentists
- `GET /api/admin/patients` - Get all patients
- `GET /api/admin/services` - Get all services
- `POST /api/admin/services` - Create service
- `GET /api/admin/appointments` - Get all appointments

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure MongoDB is running or MongoDB Atlas is accessible
- Verify `DATABASE_URL` in `.env` is correct
- Run `npx prisma generate` after schema changes
- Check network connectivity for MongoDB Atlas

### Email Not Sending

- Verify `RESEND_API_KEY` is set in `.env`
- Check Resend dashboard for email logs and quota
- Ensure email sender address is verified in Resend
- Check spam folder for verification emails

### Authentication Issues

- Clear browser cookies and localStorage
- Verify `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` are set correctly
- Check middleware configuration in `middleware.ts`
- Ensure email is verified before signing in

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder: `rm -rf .next && npm run build`
- Run `npx prisma generate` to regenerate Prisma Client
- Check TypeScript errors: `npx tsc --noEmit`

### Payment Issues

- Verify Stripe API keys in `.env`
- Use Stripe test mode keys for development
- Check Stripe dashboard for test transactions
- Ensure webhook secret is configured for production

## 🚀 Deployment

### Recommended Platforms

#### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

#### MongoDB Atlas Setup

1. Create cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist Vercel IPs or allow all IPs (0.0.0.0/0)
3. Create database user
4. Get connection string and update `DATABASE_URL`

#### Post-Deployment

1. Update Google OAuth redirect URIs to production domain
2. Update `BETTER_AUTH_URL` to production URL
3. Update `NEXT_PUBLIC_APP_URL` to production URL
4. Configure Stripe webhook endpoint
5. Run `npx prisma db push` from Vercel CLI or locally (connected to production DB)

## 📝 License

This project is for educational/demonstration purposes.

## 👥 Contributors

- Development Team
- [Your Name/Team Name]

## 📞 Support

For questions, issues, or feature requests:

- Open an issue on GitHub
- Contact the development team
- Check documentation in `/docs`

---

**Built with ❤️ using Next.js 15, TypeScript, MongoDB, and modern web technologies.**
