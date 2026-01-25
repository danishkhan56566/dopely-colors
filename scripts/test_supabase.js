
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cafwmpzdgatxpavuwnvh.supabase.co';
const supabaseAnonKey = 'sb_publishable_S5cNoYZ_FXWt9nHOwWGHjg_N1mVxbvV';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('Testing Supabase Connection...');
    const start = Date.now();
    try {
        const { data, error } = await supabase.from('categories').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('Supabase Error:', error);
        } else {
            console.log('Success! Connection verified.');
            console.log(data);
        }
    } catch (err) {
        console.error('Request failed:', err);
    }
    console.log(`Took ${Date.now() - start}ms`);
}

testConnection();
