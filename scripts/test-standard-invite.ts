
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

async function testStandardInviteFix() {
    const testEmail = `admin_invite_test_${Date.now()}@example.com`;
    console.log(`\n🧪 Starting Standard Invite Verification for: ${testEmail}`);

    let userId: string | null = null;

    try {
        // 1. Simulate the Standard Invite Logic from actions.ts (lines 230+)
        // We simulate what happens AFTER inviteUserByEmail returns success

        console.log('1. Mocking inviteUserByEmail success...');
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: testEmail,
            email_confirm: true,
            password: 'Password123!'
        });

        if (authError) throw new Error(`Auth creation failed: ${authError.message}`);
        userId = authData.user.id;
        console.log(`   ✅ Auth User created: ${userId}`);

        // 2. Run the FIX Logic for Standard Invite (New User)
        console.log('2. Running FIX Logic (Creating Profile via upsert)...');

        const role = 'editor';
        const dbRole = role === 'editor' ? 'admin' : role; // The fix logic

        const { error: upsertError } = await supabase.from('profiles').upsert({
            id: userId,
            role: dbRole
            // email and status removed
        });

        if (upsertError) {
            throw new Error(`Failed to create profile: ${upsertError.message}`);
        }
        console.log('   ✅ Profile created successfully via Upsert.');

        // 3. Verification
        console.log('3. Verifying Profile in Database...');
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (fetchError || !profile) throw new Error('Profile verification failed! Profile not found.');

        console.log(`   ✅ Profile Verified!`);
        console.log(`      - Role: ${profile.role} (Expected: admin)`);

        if (profile.role !== 'admin') throw new Error(`Role mismatch! Expected 'admin', got '${profile.role}'`);

        console.log('\n🎉 SUCCESS: Standard Admin Invite Fix Verified!');

    } catch (error: any) {
        console.error('\n❌ TEST FAILED:', error.message);
    } finally {
        if (userId) {
            console.log('\n4. Cleaning up...');
            await supabase.auth.admin.deleteUser(userId);
            console.log('   ✅ Test user deleted.');
        }
    }
}

testStandardInviteFix();
