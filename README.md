# Dental U Care

A modern dental clinic management application built with Next.js, featuring appointment booking, patient management, and secure authentication.

## 🚀 Features

- **Landing Page** with colorful shadow effects
- **Authentication System** with Google OAuth and email/password
- **Protected Dashboard** with patient management
- **Appointment Booking** system
- **Responsive Design** with dark mode support
- **Service Pricing** with interactive tabs

## 🔐 Authentication

This project uses [Better Auth](https://better-auth.com) for authentication. See the authentication documentation:

- **[AUTH_IMPLEMENTATION_SUMMARY.md](./AUTH_IMPLEMENTATION_SUMMARY.md)** - Overview of what's implemented
- **[AUTH_QUICK_REFERENCE.md](./AUTH_QUICK_REFERENCE.md)** - Quick reference guide
- **[NEXTJS_INTEGRATION.md](./NEXTJS_INTEGRATION.md)** - Complete Next.js integration guide
- **[GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md)** - Google OAuth setup instructions

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Google Cloud Platform account (for OAuth)

## ⚙️ Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth (Required)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

See [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) for instructions on getting your Google OAuth credentials.

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
dental-u-care/
├── app/
│   ├── api/auth/[...all]/    # Auth API routes
│   ├── dashboard/             # Protected dashboard
│   ├── login/                 # Login page
│   ├── signup/                # Signup page
│   └── page.tsx               # Landing page
├── components/
│   ├── auth/                  # Auth forms
│   ├── landing/               # Landing page sections
│   ├── layout/                # Layout components
│   └── ui/                    # UI components
├── lib/
│   ├── auth.ts                # Auth configuration
│   ├── auth-client.ts         # Client-side auth
│   ├── auth-server.ts         # Server-side auth
│   └── auth-actions.ts        # Server actions
└── middleware.ts              # Route protection
```

## 🎯 Key Pages

- `/` - Landing page with services and pricing
- `/login` - Sign in with Google or email/password
- `/signup` - Create a new account
- `/dashboard` - Protected dashboard (requires authentication)

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎨 UI Components

Built with:
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icons

## 📱 Responsive Design

The application is fully responsive and supports:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1440px+)

## 🌙 Dark Mode

Built-in dark mode support with theme toggle.

## 🔒 Security

- Server-side session validation
- HTTP-only secure cookies
- CSRF protection
- Encrypted passwords
- OAuth 2.0 for Google sign-in

## 📚 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### Better Auth Resources
- [Better Auth Documentation](https://better-auth.com)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Update Google OAuth redirect URIs to your production domain

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Next.js.

## 📝 License

This project is for educational/demonstration purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Built with ❤️ using Next.js and Better Auth**
