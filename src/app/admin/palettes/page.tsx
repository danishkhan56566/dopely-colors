import { createClient } from '@/lib/supabase-server';
import PaletteList from '@/components/admin/palettes/PaletteList';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminPalettesPage() {
    const supabase = await createClient();

    // Check Auth (Redundant if middleware works, but safe)
    const { data: { user } } = await supabase.auth.getUser();
    // if (!user) {
    //     redirect('/login');
    // }

    // 1. Fetch Total Count (Cheap)
    const { count } = await supabase
        .from('palettes')
        .select('*', { count: 'exact', head: true });

    // 2. Fetch Data (Limit to 2000 for performance, but show full count)
    const { data: palettes, error } = await supabase
        .from('palettes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2000);

    if (error) {
        return (
            <div className="p-8 text-center text-red-600">
                <h2 className="text-xl font-bold mb-2">Server Error</h2>
                <p>Failed to load palettes: {error.message}</p>
            </div>
        );
    }

    return (
        <PaletteList
            initialPalettes={palettes || []}
            totalCount={count || 0}
        />
    );
}
