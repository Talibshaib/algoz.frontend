/**
 * Application Routes
 * 
 * This file serves as the central configuration for all routes in the application.
 * All route-related constants should be defined here to ensure consistency
 * throughout the application and simplify maintenance.
 */

// Authentication routes
export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
};

// Individual auth route exports for convenience
export const LOGIN_ROUTE = AUTH_ROUTES.LOGIN;
export const SIGNUP_ROUTE = AUTH_ROUTES.SIGNUP;
export const FORGOT_PASSWORD_ROUTE = AUTH_ROUTES.FORGOT_PASSWORD;
export const RESET_PASSWORD_ROUTE = AUTH_ROUTES.RESET_PASSWORD;

// Dashboard routes
export const DASHBOARD_ROUTES = {
  HOME: '/dashboard',
  SETTINGS: '/dashboard/settings',
  WEBHOOK: '/dashboard/webhook',
  API_CREDENTIALS: '/dashboard/api-credentials',
  BROKER_MANAGEMENT: '/dashboard/broker-management',
  PRICING: '/dashboard/pricing',
  PROFILE: '/dashboard/profile',
  STATUS: '/dashboard/status',
};

// Individual dashboard route exports for convenience
export const DASHBOARD_ROUTE = DASHBOARD_ROUTES.HOME;
export const SETTINGS_ROUTE = DASHBOARD_ROUTES.SETTINGS;
export const WEBHOOK_ROUTE = DASHBOARD_ROUTES.WEBHOOK;
export const API_CREDENTIALS_ROUTE = DASHBOARD_ROUTES.API_CREDENTIALS;
export const BROKER_MANAGEMENT_ROUTE = DASHBOARD_ROUTES.BROKER_MANAGEMENT;
export const PRICING_ROUTE = DASHBOARD_ROUTES.PRICING;
export const PROFILE_ROUTE = DASHBOARD_ROUTES.PROFILE;
export const STATUS_ROUTE = DASHBOARD_ROUTES.STATUS;

// Admin routes
export const ADMIN_ROUTES = {
  HOME: '/admin',
  USERS: '/admin/users',
  SETTINGS: '/admin/settings',
};

// Individual admin route exports for convenience
export const ADMIN_ROUTE = ADMIN_ROUTES.HOME;
export const ADMIN_USERS_ROUTE = ADMIN_ROUTES.USERS;
export const ADMIN_SETTINGS_ROUTE = ADMIN_ROUTES.SETTINGS;

// Static/marketing page routes
export const STATIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  HELP: '/help',
  TERMS: '/terms',
  PRIVACY_POLICY: '/privacy-policy',
  DISCLAIMER: '/disclaimer',
  COOKIES: '/cookies',
};

// Individual static route exports for convenience
export const HOME_ROUTE = STATIC_ROUTES.HOME;
export const ABOUT_ROUTE = STATIC_ROUTES.ABOUT;
export const CONTACT_ROUTE = STATIC_ROUTES.CONTACT;
export const HELP_ROUTE = STATIC_ROUTES.HELP;
export const TERMS_ROUTE = STATIC_ROUTES.TERMS;
export const PRIVACY_ROUTE = STATIC_ROUTES.PRIVACY_POLICY;
export const DISCLAIMER_ROUTE = STATIC_ROUTES.DISCLAIMER;
export const COOKIES_ROUTE = STATIC_ROUTES.COOKIES;

// API routes
export const API_ROUTES = {
  BASE: '/api',
  V1: '/api/v1',
  HEALTH: '/api/v1/health/status',
  WEBHOOK: '/api/v1/webhook',
  AUTH: '/api/v1/auth',
};

// Individual API route exports for convenience
export const API_BASE_ROUTE = API_ROUTES.BASE;
export const API_V1_ROUTE = API_ROUTES.V1;
export const API_HEALTH_ROUTE = API_ROUTES.HEALTH;
export const API_WEBHOOK_ROUTE = API_ROUTES.WEBHOOK;
export const API_AUTH_ROUTE = API_ROUTES.AUTH;

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  STATIC_ROUTES.HOME,
  STATIC_ROUTES.ABOUT,
  STATIC_ROUTES.CONTACT,
  STATIC_ROUTES.HELP,
  STATIC_ROUTES.TERMS,
  STATIC_ROUTES.PRIVACY_POLICY,
  STATIC_ROUTES.DISCLAIMER,
  STATIC_ROUTES.COOKIES,
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.SIGNUP,
  AUTH_ROUTES.FORGOT_PASSWORD,
  AUTH_ROUTES.RESET_PASSWORD,
];

// Routes that should bypass authentication checks completely
export const BYPASS_ROUTES = [
  '/_next',
  '/static',
  '/api',
  '/favicon.ico',
  '/.well-known',
];

// Helper functions
export function isAuthRoute(path: string): boolean {
  return Object.values(AUTH_ROUTES).some(route => path === route);
}

export function isDashboardRoute(path: string): boolean {
  return path.startsWith(DASHBOARD_ROUTES.HOME);
}

export function isAdminRoute(path: string): boolean {
  return path.startsWith(ADMIN_ROUTES.HOME);
}

export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    // Match exact routes or routes with query parameters 
    path === route || path.startsWith(`${route}?`)
  );
}

export function isBypassRoute(path: string): boolean {
  return BYPASS_ROUTES.some(route => path.startsWith(route)) || path.includes('.');
} 