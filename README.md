# AlgoZ Frontend

This is the frontend for the AlgoZ application, a trading platform that connects to various brokers and exchanges.

## Technology Stack

- Next.js with React
- TypeScript
- Tailwind CSS
- Supabase for database and authentication
- Radix UI components

## Environment Variables

Make sure to set the following environment variables in your `.env.local` file:

```bash
# API URLs
NEXT_PUBLIC_API_URL=https://algoz-backend-68rt.onrender.com/api/v1
NEXT_PUBLIC_API_URL_HTTPS=https://algoz-backend-68rt.onrender.com/api/v1
NEXT_PUBLIC_FALLBACK_API_URL=https://algoz-backend-68rt.onrender.com/api/v1
NEXT_PUBLIC_FALLBACK_API_URL_HTTPS=https://algoz-backend-68rt.onrender.com/api/v1
NEXT_PUBLIC_FALLBACK_API_URL_WITH_PORT=https://algoz-backend-68rt.onrender.com/api/v1
NEXT_PUBLIC_LOCAL_API_URL=http://localhost:8000/api/v1

# MetaAPI configuration
NEXT_PUBLIC_METAAPI_TOKEN=your_metaapi_token_here

# Environment
NEXT_PUBLIC_ENVIRONMENT=development

# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Database URL (if using Prisma)
DATABASE_URL=postgresql://postgres:password@project-ref.supabase.co:5432/postgres
```

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Key Features

- Secure authentication with JWT and Supabase
- Connection to multiple trading brokers
- Real-time market data
- Trading strategy execution
- Admin dashboard for platform management

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: Reusable UI components
- `src/contexts`: React context providers (auth, theme, etc.)
- `src/hooks`: Custom React hooks
- `src/lib`: Utilities and libraries (axios, supabase)
- `src/services`: API service functions
- `src/utils`: Helper functions and utilities
- `src/types`: TypeScript type definitions
- `public`: Static assets

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/)
- [Supabase Documentation](https://supabase.io/docs)