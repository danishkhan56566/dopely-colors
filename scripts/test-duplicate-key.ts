
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function testDuplicateKeyError() {
    const testEmail = `admin_dup_test_${Date.now()}@example.com`;
    console.log(`\n🧪 Testing Duplicate Key Error for: ${testEmail}`);
    let userId: string | null = null;

    try {
        // 1. Setup: Create User AND Profile (State: Exists in both)
        console.log('1. Creating User and Profile...');
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: testEmail,
            email_confirm: true,
            password: 'Password123!'
        });
        if (authError || !authData.user) throw new Error(`Auth setup failed: ${authError?.message}`);
        userId = authData.user.id;

        // Create profile manually (ensure it exists)
        const { error: profileError } = await supabase.from('profiles').insert({
            id: userId,
            role: 'user'
        });
        if (profileError) throw new Error(`Profile setup failed: ${profileError.message}`);
        console.log('   ✅ User & Profile created.');

        // 2. Simulate the Buggy Logic from actions.ts
        // The code tries to find profile by email -> fails -> tries to insert -> BOOM
        console.log('2. Running Buggy Logic (Look up by Email)...');

        // A. Lookup by Email (Simulating the broken code)
        // This will fail because 'email' column doesn't exist
        const { data: profile, error: lookupError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', testEmail) // FAIL POINT
            .single();

        console.log(`   - Lookup result: ${profile ? 'Found' : 'Not Found'} (Error: ${lookupError?.message})`);

        if (lookupError || !profile) {
            console.log('   Warning: Profile not found via email (Expected due to schema). Proceeding to Insert...');

            // B. Resolve ID via Link (works)
            const { data: linkData } = await supabase.auth.admin.generateLink({
                type: 'magiclink',
                email: testEmail
            });

            if (linkData.user) {
                // C. Attempt Insert (The Fatal Step)
                console.log('   - Attempting Insert (Should fail)...');
                const { error: insertError } = await supabase.from('profiles').insert({
                    id: linkData.user.id,
                    role: 'admin'
                });

                if (insertError) {
                    if (insertError.message.includes('profiles_pkey')) {
                        console.log('   ✅ REPRODUCED: Duplicate key value violates unique constraint "profiles_pkey"');
                    } else {
                        console.log(`   ❌ Failed with different error: ${insertError.message}`);
                    }
                } else {
                    console.log('   ❌ Unexpected success (Insert matched?)');
                }
            }
        }
    } catch (error: any) {
        console.error('Test Error:', error);
    } finally {
        if (userId) await supabase.auth.admin.deleteUser(userId);
    }
}

testDuplicateKeyError();
