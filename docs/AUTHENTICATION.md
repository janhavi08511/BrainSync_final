# Authentication Setup Guide

## Overview

User authentication has been integrated using Supabase Auth with email and password.

## Features Implemented

### 1. **Authentication Flow**

- Home page is public (accessible without login)
- All feature cards and protected pages require authentication
- Users are redirected to login page when accessing protected routes
- After successful login, users are redirected to Dashboard page

### 2. **UI Components**

- **Login/Sign Up Page** (`/login`)
  - Tabbed interface for Sign In and Sign Up
  - Email and password authentication
  - Redirects to intended page after login
- **Header Navigation**
  - Login button in top right corner (when logged out)
  - User menu dropdown with email and logout (when logged in)
  - Works on both desktop and mobile

### 3. **Protected Routes**

The following pages require authentication:

- `/dashboard` - Dashboard Page
- `/translate` - Translation Page
- `/history` - History Page

### 4. **Database Security**

- Row Level Security (RLS) enabled on translations table
- Users can only view/edit their own translations
- Automatic user ID management via Supabase Auth

## Setup Instructions

### 1. Supabase Configuration

Ensure your `.env` file has the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Run Database Migration

Apply the authentication migration to your Supabase project:

```bash
# If using Supabase CLI
supabase db push

# Or manually apply the migration in Supabase Dashboard SQL Editor
```

The migration file is located at:
`supabase/migrations/00002_add_authentication.sql`

### 3. Enable Email Auth in Supabase

1. Go to Supabase Dashboard
2. Navigate to Authentication > Providers
3. Enable Email provider
4. Configure email templates (optional)

## How It Works

### Authentication Context

- `AuthContext.tsx` provides authentication state across the app
- Manages user session, login, signup, and logout
- Automatically syncs with Supabase Auth state

### Protected Routes

- `ProtectedRoute.tsx` component wraps authenticated pages
- Shows loading state while checking authentication
- Redirects to login with return URL if not authenticated

### User Flow

1. User visits home page (public)
2. User clicks on any feature card
3. If not logged in → redirected to `/login?redirect=/translate?tab=text`
4. After login → redirected to the original destination (Dashboard by default)
5. User can access all protected features
6. Logout returns to home page

## Testing

### Create Test Account

1. Click "Login" in header
2. Go to "Sign Up" tab
3. Enter email and password (min 6 characters)
4. Click "Sign Up"
5. You'll be automatically logged in and redirected to Dashboard

### Test Protected Routes

1. Try accessing `/translate` while logged out → redirects to login
2. Login and verify you can access all pages
3. Check that translations are saved under your user account
4. Logout and verify you're redirected to home page

## Files Modified/Created

### New Files

- `src/contexts/AuthContext.tsx` - Authentication context provider
- `src/pages/LoginPage.tsx` - Login/Sign up page
- `src/components/ProtectedRoute.tsx` - Route protection component
- `supabase/migrations/00002_add_authentication.sql` - Database security migration

### Modified Files

- `src/routes.tsx` - Added login route and protected route wrappers
- `src/App.tsx` - Wrapped app with AuthProvider
- `src/components/common/Header.tsx` - Added login/logout button and user menu
- `src/db/api.ts` - Updated to use authenticated user IDs instead of localStorage UUIDs

## Notes

- All translations are now linked to authenticated users
- Previous anonymous translations won't be visible (they used different UUIDs)
- Email confirmation can be configured in Supabase (disabled by default for development)
- Password reset functionality can be added later using Supabase Auth
