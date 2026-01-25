'use server';

import { createAdminClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export type FeaturedPalette = {
    id: string;
    name: string;
    colors: string[];
    favorites_count: number;
    views_count: number;
    featured_order: number | null;
    is_featured: boolean;
};

export async function getFeaturedPalettes(): Promise<FeaturedPalette[]> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('palettes')
        .select('id, name, colors, favorites_count, views_count, featured_order, is_featured')
        .eq('is_featured', true)
        .order('featured_order', { ascending: true });

    if (error) {
        console.error("Error fetching featured palettes:", error);
        return [];
    }

    return data || [];
}

export async function updateFeaturedOrder(items: { id: string; featured_order: number }[]) {
    const supabase = createAdminClient();

    // Loop through and update. For small numbers (top 6), a loop is fine.
    // Ideally we might using an upsert or CASE statement, but loop is simplest "working" solution for <10 items.
    for (const item of items) {
        const { error } = await supabase
            .from('palettes')
            .update({ featured_order: item.featured_order })
            .eq('id', item.id);

        if (error) {
            console.error(`Error updating order for ${item.id}:`, error);
            throw new Error(`Failed to update order for ${item.id}`);
        }
    }

    revalidatePath('/admin/featured');
    return { success: true };
}

export async function removeFromFeatured(id: string) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('palettes')
        .update({ is_featured: false, featured_order: null })
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/featured');
    return { success: true };
}

export async function searchPalettes(query: string) {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('palettes')
        .select('id, name, colors, favorites_count')
        .ilike('name', `%${query}%`)
        .eq('is_featured', false) // Only show ones not already featured? Or allow re-featuring?
        .eq('status', 'published') // Only published ones
        .limit(10);

    if (error) {
        console.error(error);
        return [];
    }

    return data || [];
}

export async function addToFeatured(id: string) {
    const supabase = createAdminClient();

    // Get current max order
    const { data: maxOrderData } = await supabase
        .from('palettes')
        .select('featured_order')
        .eq('is_featured', true)
        .order('featured_order', { ascending: false })
        .limit(1)
        .single();

    const nextOrder = (maxOrderData?.featured_order || 0) + 1;

    const { error } = await supabase
        .from('palettes')
        .update({ is_featured: true, featured_order: nextOrder })
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/featured');
    return { success: true };
}
