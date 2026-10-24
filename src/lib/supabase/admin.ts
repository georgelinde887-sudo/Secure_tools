import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let adminClient: ReturnType<typeof createSupabaseClient> | null = null;

export function getAdminClient() {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase Service Role Key or URL for admin client.');
  }

  adminClient = createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
