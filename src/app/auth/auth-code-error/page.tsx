'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AuthErrorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorParam = searchParams.get('error');
    const [status, setStatus] = useState('Finalizing login...');

    useEffect(() => {
        const handleSession = async () => {
            // 1. Check for Implicit Flow (Hash)
            if (window.location.hash && window.location.hash.includes('access_token')) {
                setStatus('Found session token, redirecting...');
                const { data, error } = await supabase.auth.getSession();
                if (data.session) {
                    router.replace('/dashboard');
                    return;
                }
            }

            // 2. Check for existing session (Maybe logic moved fast)
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                router.replace('/dashboard');
                return;
            }

            // 3. Fallback check
            setTimeout(() => {
                setStatus('Please wait...');
                // Attempt one last check
                supabase.auth.getSession().then(({ data }) => {
                    if (data.session) router.replace('/dashboard');
                    else {
                        if (errorParam) setStatus(`Error: ${errorParam}`);
                        else setStatus("Starting fresh...");
                    }
                })
            }, 2000);
        };

        handleSession();
    }, [router, errorParam]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
                {status.includes('Error') ? (
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                ) : (
                    <Loader2 className="animate-spin w-10 h-10 text-blue-600 mx-auto mb-4" />
                )}

                <h1 className="text-lg font-bold text-gray-900 mb-2">
                    {status}
                </h1>

                <div className="mt-8 border-t pt-6">
                    <button
                        onClick={() => router.push('/login')}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        </div>
    );
}
