
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function reproduceDuplicateKey() {
    console.log('🧪 Reproducing Duplicate Key Error...');
    const testEmail = `dup_test_${Date.now()}@example.com`;
    let userId: string | null = null;

    try {
        // 1. Create User
        const { data: authData } = await supabase.auth.admin.createUser({
            email: testEmail,
            email_confirm: true,
            password: 'Password123!'
        });
        if (!authData.user) throw new Error('User creation failed');
        userId = authData.user.id;
        console.log(`   ✅ User created: ${userId}`);

        // 2. Ensure Profile Exists (Handle potential trigger creation)
        const { error: insertError } = await supabase.from('profiles').insert({
            id: userId,
            role: 'user'
        });

        if (insertError) {
            console.log('   ℹ️ Profile creation skipped (likely exists via trigger):', insertError.message);
        } else {
            console.log('   ✅ Profile manually created.');
        }

        // 3. THE REPRODUCTION: Simulate inviteAdmin's flawed logic
        console.log('\n   ⚠️ Running faulty logic (Lookup by Email)...');

        // A. Flawed Lookup (will fail)
        const { data: profile, error: lookupError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', testEmail) // <--- THIS IS THE BUG
            .single();

        console.log(`      Lookup result: ${profile ? 'Found' : 'Not Found'} (Error: ${lookupError?.message || 'None'})`);

        if (!profile) {
            console.log('      -> Code assumes profile is missing.');
            console.log('      -> Attempting INSERT...');

            // B. Flawed Insert (will collide)
            const { error: duplicateError } = await supabase.from('profiles').insert({
                id: userId,
                role: 'admin'
            });

            if (duplicateError && duplicateError.message.includes('profiles_pkey')) {
                console.log(`\n   ✅ SUCCESS: Reproduced "duplicate key value violates unique constraint 'profiles_pkey'"`);
            } else {
                console.log(`\n   ❌ Failed to reproduce exact error. Got: ${duplicateError?.message}`);
            }
        } else {
            console.log('\n   ❌ Failed to reproduce: Lookup somehow succeeded?');
        }

    } catch (e: any) {
        console.error('Test failed:', e);
    } finally {
        if (userId) await supabase.auth.admin.deleteUser(userId);
    }
}

reproduceDuplicateKey();
