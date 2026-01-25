import { createClient } from '@/lib/supabase-server';
import CategoryList from '@/components/admin/categories/CategoryList';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

    return <CategoryList initialCategories={categories || []} />;
}
