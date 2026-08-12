import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ykbqyiproqcfgdgjyuve.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_x20ta_exCr6-s41mvU6Qeg_v5srwvk3';

export const supabase = createClient(supabaseUrl, supabaseKey);
