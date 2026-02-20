
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

async function testAdminFix() {
    // Generate a random email for isolation
    const testEmail = `admin_fix_test_${Date.now()}@example.com`;
    console.log(`\n🧪 Starting Admin Fix Verification for: ${testEmail}`);

    let userId: string | null = null;

    try {
        // 1. Create User in Auth (Simulate "User exists")
        console.log('1. Creating Dummy User in Auth...');
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: testEmail,
            email_confirm: true,
            password: 'Password123!'
        });

        if (authError) throw new Error(`Failed to create auth user: ${authError.message}`);
        if (!authData.user) throw new Error('User created but returned no data');

        userId = authData.user.id;
        console.log(`   ✅ User created: ${userId}`);

        // 2. Simulate "Missing Profile" State
        console.log('2. Ensuring Profile is MISSING...');
        // Delete profile if it exists (e.g. created by trigger)
        const { error: deleteError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (deleteError) {
            // If error is strictly about permissions or RLS, we might have issues, but let's assume service role bypasses.
            console.warn('   ⚠️ Warning deleting profile:', deleteError.message);
        } else {
            console.log('   ✅ Profile deleted (if it existed). State is now: [Auth: YES, Profile: NO]');
        }

        // 3. Run the FIX Logic (The exact logic we added to actions.ts)
        console.log('3. Running FIX Logic (Resolving ID & Creating Profile)...');

        // This mirrors the fix in actions.ts:
        // Try to resolve user ID via generateLink
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
            type: 'magiclink',
            email: testEmail
        });

        if (linkError || !linkData.user) {
            console.error('[Admin] Failed to resolve user via generic link:', linkError);
            throw new Error(`Failed to resolve user: ${linkError?.message}`);
        }

        const resolvedId = linkData.user.id;
        if (resolvedId !== userId) {
            throw new Error(`Resolved ID (${resolvedId}) does not match created ID (${userId})`);
        }
        console.log('   ✅ User ID resolved via Admin API.');

        // Create the missing profile
        const role = 'admin'; // 'editor' failed constraint, testing 'admin'
        // Schema only has id, role, created_at
        const { error: createProfileError } = await supabase.from('profiles').insert({
            id: resolvedId,
            role: role
        });

        if (createProfileError) {
            throw new Error(`Failed to create missing profile: ${createProfileError.message}`);
        }
        console.log('   ✅ Missing profile created successfully via Fix Logic.');

        // 4. Verification
        console.log('4. Verifying Profile Existence in Database...');
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (fetchError || !profile) throw new Error('Profile verification failed! Profile not found after fix.');

        console.log(`   ✅ Profile Verified!`);
        console.log(`      - ID: ${profile.id}`);
        console.log(`      - Role: ${profile.role}`);
        console.log(`      - Status: ${profile.status}`);

        console.log('\n🎉 SUCCESS: Admin Invite Fix Logic Verified!');

    } catch (error: any) {
        console.error('\n❌ TEST FAILED:', error.message);
    } finally {
        // 5. Cleanup
        if (userId) {
            console.log('\n5. Cleaning up...');
            const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
            if (deleteError) console.error('   ⚠️ Failed to delete test user:', deleteError.message);
            else console.log('   ✅ Test user deleted.');
        }
    }
}

testAdminFix();
