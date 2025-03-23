import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

/**
 * Middleware utility for updating sessions
 * This is used to refresh tokens and pass them between server and client
 */
export async function updateSession(request: NextRequest) {
  // Create a response object that we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase client using cookies from the request
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Use let for token-related variables to support refreshing
          request.cookies.set({
            name,
            value,
            ...options,
          });
          
          // Update the response cookies
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          // Use let for token-related variables to support refreshing
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          
          // Update the response cookies
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Fix: Use set with empty value and max-age=0 instead of remove
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0
          });
        },
      },
    }
  );

  // Attempt to refresh the session if it exists but might be expired
  try {
    // Use let for token-related variables to support refreshing
    let { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // If session exists but might be close to expiry, refresh it
      const expiresAt = session.expires_at || 0; // Fix: Add default value to handle undefined
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = expiresAt - currentTime;
      
      // If session expires in less than 60 minutes (3600 seconds), refresh it
      if (timeUntilExpiry < 3600) {
        console.log('[DEBUG] Session nearing expiry, attempting refresh...');
        const { data } = await supabase.auth.refreshSession();
        if (data.session) {
          console.log('[DEBUG] Session refreshed successfully');
          // Update session with refreshed session
          session = data.session;
        }
      }
    }
  } catch (error) {
    console.error('[ERROR] Error refreshing session in middleware:', error);
    // Continue anyway - we'll handle auth state in the components
  }

  return response;
}
