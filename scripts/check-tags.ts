
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://cafwmpzdgatxpavuwnvh.supabase.co',
    'sb_secret_MqeKah2URuj3mu1AG6TsiA_r5PC8PZE'
);

async function checkTags() {
    const tagsToCheck = ['Neon', 'Dark', 'Pastel'];

    for (const tag of tagsToCheck) {
        const { count, error } = await supabase
            .from('palettes')
            .select('*', { count: 'exact', head: true })
            .contains('category', [tag]);

        if (error) console.error(`Error checking ${tag}:`, error);
        else console.log(`Count for ${tag}:`, count);
    }
}

checkTags();
