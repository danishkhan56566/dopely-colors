
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://cafwmpzdgatxpavuwnvh.supabase.co',
    'sb_secret_MqeKah2URuj3mu1AG6TsiA_r5PC8PZE'
);

async function checkSchema() {
    console.log('Fetching palette...');
    const { data, error } = await supabase.from('palettes').select('*').limit(1);
    if (error) {
        console.error('Error:', error);
    } else {
        if (data && data.length > 0) {
            console.log('Sample Palette Keys:', Object.keys(data[0]));
            console.log('Sample Palette Tags/Category:', {
                category: data[0].category,
                tags: data[0].tags,
                categories: data[0].categories
            });
        } else {
            console.log('No palettes found in DB.');
        }
    }
}

checkSchema();
