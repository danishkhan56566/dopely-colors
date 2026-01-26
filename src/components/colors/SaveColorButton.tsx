'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import clsx from 'clsx';


interface SaveColorButtonProps {
    hex: string;
    name?: string;
    className?: string;
}

export const SaveColorButton = ({ hex, name, className }: SaveColorButtonProps) => {
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    // Initial check
    useEffect(() => {
        const checkStatus = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                // Check local storage for anon
                const local = JSON.parse(localStorage.getItem('dopely_favorites') || '[]');
                setIsSaved(local.includes(hex));
                setIsLoading(false);
                return;
            }

            setUserId(session.user.id);

            try {
                const { data } = await supabase
                    .from('saved_colors')
                    .select('id')
                    .eq('user_id', session.user.id)
                    .eq('hex', hex)
                    .single();

                setIsSaved(!!data);
            } catch (e) {
                // Table might not exist yet, fallback to local state logic visually
                console.warn('Could not check saved status', e);
            } finally {
                setIsLoading(false);
            }
        };

        checkStatus();
    }, [hex]);

    const toggleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;
        setIsLoading(true);

        const newStatus = !isSaved;

        // If not logged in, use LocalStorage
        if (!userId) {
            const local = JSON.parse(localStorage.getItem('dopely_favorites') || '[]');
            if (newStatus) {
                if (!local.includes(hex)) local.push(hex);
                toast.success('Saved to temporary favorites');
            } else {
                const idx = local.indexOf(hex);
                if (idx > -1) local.splice(idx, 1);
                toast.success('Removed from favorites');
            }
            localStorage.setItem('dopely_favorites', JSON.stringify(local));
            setIsSaved(newStatus);
            setIsLoading(false);

            // Optionally show "Login to sync" toast
            if (newStatus && Math.random() > 0.7) {
                toast('Log in to save permanently', {
                    description: 'Your favorites will be synced across devices.',
                    action: {
                        label: 'Login',
                        onClick: () => window.location.href = '/login'
                    }
                });
            }
            return;
        }

        // DB implementation
        try {
            if (newStatus) {
                const { error } = await supabase
                    .from('saved_colors')
                    .insert({ user_id: userId, hex, name: name || hex });

                if (error) throw error;
                toast.success('Saved to collection');
            } else {
                const { error } = await supabase
                    .from('saved_colors')
                    .delete()
                    .eq('user_id', userId)
                    .eq('hex', hex);

                if (error) throw error;
                toast.success('Removed from collection');
            }
            setIsSaved(newStatus);
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Could not save color. Try logging in again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleSave}
            disabled={isLoading}
            className={clsx(
                "rounded-full p-2 transition-all hover:scale-110 active:scale-95 flex items-center justify-center disabled:opacity-50",
                isSaved ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-black/5 hover:bg-black/10 text-gray-500 hover:text-red-500",
                className
            )}
            title={isSaved ? "Remove from favorites" : "Save to favorites"}
        >
            <Heart size={20} className={clsx("transition-all", isSaved && "fill-current")} />
        </button>
    );
};
