# Bling Bling Hair Salon

A full-stack salon website and appointment booking system built for a real home-based hair salon in St. Catharines, Ontario.

The project combines a responsive customer-facing website with a real-time booking system and a secure admin dashboard for managing appointments.

## Features

### Customer Website

- Responsive, mobile-first design
- Service catalogue for men's and women's hair services
- Multi-service appointment selection
- Dynamic service duration and pricing
- Interactive booking calendar
- Real-time appointment availability
- Automatic prevention of past and unavailable bookings
- 30-minute scheduling intervals
- Customer booking form with contact information and optional notes
- Booking confirmation flow
- Responsive desktop, tablet, and mobile layouts

### Booking System

- Supabase PostgreSQL backend
- Real-time availability calculated from existing appointments
- Database-level appointment conflict protection
- Prevention of overlapping bookings
- Business-hour validation
- Same-day booking validation
- Automatic release of cancelled appointment slots
- Server-side booking validation through PostgreSQL functions
- Row Level Security (RLS)

### Admin Dashboard

- Secure administrator authentication
- Persistent authenticated sessions
- Protected admin routes
- Today and upcoming appointment views
- Customer contact and service information
- Mobile-friendly appointment management
- One-click phone and email links
- Appointment cancellation
- Cancelled appointments automatically removed from active schedules

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- Lucide React

### Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security
- PostgreSQL RPC functions
- Supabase Edge Functions
- Deno

## Architecture

The application separates the public website, booking workflow, and administrative tools while using Supabase as the backend platform.

```text
Customer
   │
   ▼
React / TypeScript
   │
   ├── Public Salon Website
   │
   └── Appointment Booking
   │
   ▼
Supabase
   ├── PostgreSQL
   ├── RPC Functions
   ├── Row Level Security
   └── Authentication
            │
            ▼
       Admin Dashboard
```

Appointment availability is calculated using existing confirmed appointments. Final booking validation is also performed at the database level, preventing two customers from successfully booking overlapping appointment times even when requests occur simultaneously.

## Security

The project uses multiple layers of protection rather than relying solely on frontend validation.

- Row Level Security protects appointment data
- Public users cannot read customer appointment information
- Admin appointment access requires authentication
- Administrator authorization is verified against an admin allowlist
- Booking creation is performed through controlled database functions
- Appointment cancellation is restricted to authorized administrators
- Database constraints provide final protection against overlapping bookings
- Administrative credentials and configuration secrets are stored outside the repository

Environment files containing deployment-specific configuration are excluded from version control.

## Project Structure

```text
src/
├── admin/
│   ├── AdminLoginPage.tsx
│   └── AdminPage.tsx
│
├── components/
│   ├── BookPage.tsx
│   ├── BookingCalendar.tsx
│   └── ...
│
├── data/
│   ├── appointments.ts
│   ├── availability.ts
│   ├── booking.ts
│   └── site.ts
│
├── lib/
│   └── supabase.ts
│
└── styles/
    ├── global.css
    ├── site.css
    ├── booking.css
    ├── booking-calendar.css
    └── admin.css

supabase/
└── functions/
    └── admin-login/
```

## Running Locally

Clone the repository:

```bash
git clone https://github.com/dkim179/bling-bling-hair-salon.git
cd bling-bling-hair-salon
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Start the development server:

```bash
npm run dev
```

A compatible Supabase project and database configuration are required for booking and administrator functionality.

## Design

The interface follows a warm, minimal, editorial-inspired visual direction designed for a small private salon.

**Design direction:** Warm · Minimal · Personal · Professional · Korean-inspired

The layout prioritizes:

- Clear service information
- Simple appointment booking
- Mobile usability
- Accessible appointment management
- Minimal visual clutter

## Development Goals

This project was built both as a real-world business solution and as a full-stack software engineering project.

Key engineering goals included:

- Designing reusable React components
- Building type-safe booking workflows with TypeScript
- Separating frontend and backend responsibilities
- Implementing database-level validation
- Protecting customer information with authorization policies
- Handling race conditions during appointment booking
- Creating responsive interfaces for both customers and administrators

## Future Improvements

- SMS notifications for new appointments
- Admin date filtering and calendar views
- Appointment rescheduling
- Improved timezone handling
- Production deployment
- Real client hairstyle gallery

## Author

**Daniel Kim**

Computer Programming & Analysis graduate focused on software development, IT, and cybersecurity.

GitHub: `dkim179`