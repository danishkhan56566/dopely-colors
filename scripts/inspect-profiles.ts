
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function inspectProfiles() {
    console.log('🔍 Inspecting Profiles Table...');

    // Fetch one row to see structure
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.error('❌ Error fetching profiles:', error.message);
        return;
    }

    if (data && data.length > 0) {
        console.log('✅ Found rows. Structure:', Object.keys(data[0]));
        console.log('Sample Row:', data[0]);

        // Check distinct roles
        const { data: roles } = await supabase.from('profiles').select('role');
        if (roles) {
            const distinctRoles = [...new Set(roles.map(r => r.role))];
            console.log('Valid Roles in DB:', distinctRoles);
        }
    } else {
        console.log('⚠️ Profiles table is empty. Cannot infer structure from data.');

        // Try to insert a dummy row with just ID to see if it complains about missing columns
        // This is drastic but effective if empty.
        // Actually, let's try to describe table if possible? via rpc? No.
    }
}

inspectProfiles();
