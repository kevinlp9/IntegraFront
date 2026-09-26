import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    'VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY are not set. ' +
      'Google login will not work until .env is configured.',
  )
}

/**
 * Shared Supabase client used for Google OAuth (host-only).
 * Falls back to a harmless placeholder URL/key when env vars are missing so
 * that `createClient` (which throws synchronously on invalid input) never
 * crashes the whole app at import time. Login attempts will simply fail with
 * a normal error instead of a blank white screen.
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
)

/** Starts the Google OAuth flow, redirecting back to /dashboard on success. */
export async function loginWithGoogle() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en tu .env',
    )
  }
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/dashboard` },
  })
}

/** Returns the current session's JWT access token, if any. */
export async function getAccessToken(): Promise<string | undefined> {
  if (!isSupabaseConfigured) return undefined
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token
}
