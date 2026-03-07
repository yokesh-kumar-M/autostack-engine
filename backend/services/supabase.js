const { createClient } = require('@supabase/supabase-js');

// Default to a mock if we don't have real keys yet so the server doesn't crash on boot
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key';

let supabase;
try {
    supabase = createClient(supabaseUrl, supabaseKey);
} catch (e) {
    console.warn("Could not create Supabase client:", e.message);
}

module.exports = supabase;
