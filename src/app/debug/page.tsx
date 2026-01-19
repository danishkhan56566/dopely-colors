'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Check, X, ShieldAlert } from 'lucide-react';

export default function DebugPage() {
    const [envStatus, setEnvStatus] = useState<any>({});
    const [pingStatus, setPingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [pingError, setPingError] = useState<string>('');
    const [authTest, setAuthTest] = useState<any>(null);
    const [customEmail, setCustomEmail] = useState('');
    const [customPass, setCustomPass] = useState('');

    useEffect(() => {
        // Check loaded env vars (safe to show existence, not full content)
        setEnvStatus({
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (Hidden)' : 'Missing',
        });
    }, []);

    const testConnection = async () => {
        setPingStatus('loading');
        setPingError('');
        try {
            // Try to fetch public health check or just minimal data
            // Since we might not have tables, let's try auth session
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;
            setPingStatus('success');
        } catch (err: any) {
            console.error(err);
            setPingStatus('error');
            setPingError(err.message);
        }
    };

    const testSignup = async (useCustom = false) => {
        const testEmail = useCustom ? customEmail : `debug_${Math.floor(Math.random() * 10000)}@gmail.com`;
        const testPass = useCustom ? customPass : 'password123';

        setAuthTest(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: testEmail,
                password: testPass,
            });
            setAuthTest({
                success: !error,
                email_used: testEmail,
                data,
                error
            });
        } catch (err: any) {
            setAuthTest({ success: false, email_used: testEmail, error: err });
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8 font-mono text-sm">
            <h1 className="text-2xl font-bold mb-4">🩺 Supabase Diagnostic</h1>

            {/* 1. Environment */}
            <div className="border p-4 rounded bg-gray-50">
                <h2 className="font-bold mb-2">1. Environment Variables</h2>
                <div className="grid grid-cols-2 gap-2">
                    <div>NEXT_PUBLIC_SUPABASE_URL:</div>
                    <div className={envStatus.url ? 'text-green-600' : 'text-red-600'}>
                        {envStatus.url || 'MISSING'}
                    </div>
                    <div>NEXT_PUBLIC_SUPABASE_ANON_KEY:</div>
                    <div className={envStatus.key === 'Set (Hidden)' ? 'text-green-600' : 'text-red-600'}>
                        {envStatus.key}
                    </div>
                </div>
            </div>

            {/* 2. Connection Ping */}
            <div className="border p-4 rounded bg-gray-50">
                <h2 className="font-bold mb-2">2. Connection Test</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={testConnection}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                        Ping Server
                    </button>
                    {pingStatus === 'loading' && <Loader2 className="animate-spin" />}
                    {pingStatus === 'success' && <span className="text-green-600 flex items-center gap-2"><Check /> Connected!</span>}
                    {pingStatus === 'error' && <span className="text-red-600 flex items-center gap-2"><X /> Failed: {pingError}</span>}
                </div>
            </div>

            {/* 3. Auth Test */}
            <div className="border p-4 rounded bg-gray-50">
                <h2 className="font-bold mb-2">3. Auth Test (Signup)</h2>

                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => testSignup(false)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                    >
                        Test w/ Random Gmail
                    </button>
                </div>

                <div className="space-y-2 mb-4 p-4 bg-white rounded border">
                    <h3 className="font-bold text-xs uppercase text-gray-500">Custom Test</h3>
                    <input
                        type="email"
                        placeholder="Enter YOUR email"
                        value={customEmail}
                        onChange={e => setCustomEmail(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Enter password (min 6 chars)"
                        value={customPass}
                        onChange={e => setCustomPass(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    <button
                        onClick={() => testSignup(true)}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 w-full"
                    >
                        Try Signup with Input
                    </button>
                </div>

                {authTest && (
                    <div className="p-4 bg-white border rounded overflow-auto max-h-60 mt-4">
                        <div className="font-bold mb-2 border-b pb-1">Result for: {authTest.email_used}</div>
                        <pre>{JSON.stringify(authTest, null, 2)}</pre>
                    </div>
                )}
            </div>

            <p className="text-gray-500">Visit <code>/debug</code> to see this page.</p>
        </div>
    );
}
