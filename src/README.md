# AlgoZ Frontend Structure

This document outlines the organization of the AlgoZ frontend codebase, which follows a feature-based architecture for better maintainability and scalability.

## Directory Structure

```
frontend/src/
├── app/ (Next.js App Router)
│   ├── dashboard/ (dashboard routes)
│   ├── admin/ (admin routes)
│   └── auth/ (auth routes)
├── features/ (feature-based organization)
│   ├── auth/ (auth-related components, hooks, utils)
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── dashboard/ (dashboard-related components, hooks, utils)
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── admin/ (admin-related components, hooks, utils)
│   ├── webhook/ (webhook-related features)
│   └── user-profile/ (profile-related features)
├── components/ (shared UI components)
│   └── ui/ (UI component library)
├── hooks/ (shared custom hooks)
├── lib/ (shared utilities, configurations)
│   ├── supabase.ts (Supabase client)
│   └── axios.ts (Axios configuration)
├── constants/ (application constants)
└── types/ (TypeScript type definitions)
```

## Import Guidelines

When working with the feature-based structure, use the following import patterns:

1. **For feature-specific components/hooks/utils:**
   ```typescript
   // Import from the specific feature
   import { LoginPage } from '@/features/auth/components/LoginPage';
   import { useAuthenticatedApi } from '@/features/auth/hooks/useAuthenticatedApi';
   import { signOut } from '@/features/auth/utils/auth-helpers';
   ```

2. **For shared UI components:**
   ```typescript
   // Import shared UI components
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';
   ```

3. **For shared utilities:**
   ```typescript
   // Import shared utilities
   import supabase from '@/lib/supabase';
   ```

4. **For constants:**
   ```typescript
   // Import constants
   import { DASHBOARD_ROUTE } from '@/constants/routes';
   ```

## Migration Tasks

The codebase is currently in transition to this new structure. The following tasks are still pending:

1. Update all import statements across the codebase to reflect the new file locations
2. Move any remaining feature-specific code to appropriate feature directories
3. Update paths in tsconfig and other configuration files if needed
4. Ensure all components use the correct paths for imports

## Guidelines for Adding New Features

When adding a new feature to the application:

1. Create a new directory under `features/` for your feature
2. Include separate directories for components, hooks, and utils within your feature directory
3. Only export what is necessary for other parts of the application
4. Keep feature-specific code within the feature directory
5. Place shared code in the appropriate directories (components/ui, hooks, lib, etc.)

## Authentication

Authentication is now handled directly through Supabase, not through context providers. Use the following pattern for authentication:

```typescript
import supabase from '@/lib/supabase';
import { signOut } from '@/features/auth/utils/auth-helpers';

// Check if user is authenticated
const { data } = await supabase.auth.getSession();
const user = data.session?.user;

// Sign out
await signOut();
``` 