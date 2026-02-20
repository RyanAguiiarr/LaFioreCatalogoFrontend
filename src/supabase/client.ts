import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldixzgnlqnagkqlawheu.supabase.co';
const supabaseKey = 'sb_publishable_bmiZ84joSPTn4F0aWgyV5A_UwMD3iGL';

export const supabase = createClient(supabaseUrl, supabaseKey);
