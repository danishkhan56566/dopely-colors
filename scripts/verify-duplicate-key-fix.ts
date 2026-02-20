
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

async function verifyDuplicateKeyFix() {
    console.log('🧪 Verifying Fix for Duplicate Key Error...');
    const testEmail = `fix_test_${Date.now()}@example.com`;
    let userId: string | null = null;

    try {
        // 1. Setup: Create User & Profile (Collision Scenario)
        console.log('1. Creating User & Profile...');
        const { data: authData } = await supabase.auth.admin.createUser({
            email: testEmail,
            email_confirm: true,
            password: 'Password123!'
        });
        if (!authData.user) throw new Error('User creation failed');
        userId = authData.user.id;

        // Ensure profile exists
        await supabase.from('profiles').upsert({ id: userId, role: 'user' });
        console.log(`   ✅ Setup Complete. User & Profile exist.`);

        // 2. Run the FIXED Logic
        console.log('\n2. Running FIXED Logic...');

        // A. Resolve User ID from Auth (instead of profiles.email)
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
            type: 'magiclink',
            email: testEmail
        });

        if (linkError || !linkData.user) throw new Error(`Auth resolution failed: ${linkError?.message}`);
        const resolvedId = linkData.user.id;
        console.log(`   ✅ Resolved User ID: ${resolvedId}`);

        // B. Check Profile by ID (SAFE)
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', resolvedId)
            .single();

        if (profileError && profileError.code !== 'PGRST116') throw profileError;

        // C. Decide: Update or Insert
        if (profile) {
            console.log('   ℹ️ Profile found. Updating role...');
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' }) // Promoting 'user' -> 'admin'
                .eq('id', resolvedId);

            if (updateError) throw updateError;
            console.log('   ✅ Profile Updated Successfully.');
        } else {
            console.log('   ℹ️ Profile missing. Inserting...');
            const { error: insertError } = await supabase
                .from('profiles')
                .insert({ id: resolvedId, role: 'admin' });

            if (insertError) throw insertError;
            console.log('   ✅ Profile Inserted Successfully.');
        }

        // 3. Verify Final State
        const { data: finalProfile } = await supabase.from('profiles').select('role').eq('id', resolvedId).single();
        if (finalProfile?.role === 'admin') {
            console.log('\n🎉 SUCCESS: User promoted to admin without duplicate key error!');
        } else {
            console.error('\n❌ FAILURE: Role was not updated.');
        }

    } catch (e: any) {
        console.error('\n❌ TEST FAILED:', e.message);
    } finally {
        if (userId) await supabase.auth.admin.deleteUser(userId);
    }
}

verifyDuplicateKeyFix();
