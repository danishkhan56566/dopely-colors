'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function createCategoryAction(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get('name') as string;
    const color = formData.get('color') as string || 'bg-gray-500';
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

    if (!name) return { error: 'Name is required' };

    try {
        const { error } = await supabase
            .from('categories')
            .insert([{ name, slug, color }]);

        if (error) {
            if (error.code === '23505') {
                return { error: 'Category with this name already exists.' };
            }
            throw error;
        }

        revalidatePath('/admin/categories');
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function deleteCategoryAction(id: string) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/admin/categories');
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}
