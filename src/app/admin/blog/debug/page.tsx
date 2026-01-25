'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Shield, Check, X, AlertTriangle, User } from 'lucide-react';

export default function DebugBlogPage() {
    const [status, setStatus] = useState<any>({});
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        runDiagnostics();
    }, []);

    const runDiagnostics = async () => {
        setLoading(true);
        const report: any = {};

        try {
            // 1. Check Auth
            const { data: { session }, error: authError } = await supabase.auth.getSession();
            report.auth = {
                authenticated: !!session,
                user: session?.user?.id || 'None',
                role: session?.user?.role || 'None',
                error: authError?.message
            };

            // 2. Check Table Existence & RLS (as Auth User)
            const { count: authCount, error: dbError } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true });

            report.db_auth = {
                accessible: !dbError,
                count: authCount,
                error: dbError?.message,
                code: dbError?.code
            };

            // FORCE ERROR CHECK: If count is null, try a simple insert to provoke an RLS error
            if (authCount === null) {
                const { error: insertError } = await supabase.from('posts').insert({ title: 'Probe', slug: 'probe-' + Date.now(), status: 'draft' }).select();
                if (insertError) {
                    report.db_auth.force_error = insertError.message;
                    report.db_auth.force_code = insertError.code;
                }
            }

            // 3. Check Public Read (as Anon - simulate by making a fresh client if needed, or just trusting the policy? 
            // Better to test via fetching a known published post if we can, but we don't know any IDs)
            // We can't easily simulate Anon here without signing out.
            // But we can check if there are ANY published posts visible to *us* (if we are admin, we see all).

            // 4. Fetch actual rows to see status
            const { data: rows } = await supabase
                .from('posts')
                .select('id, title, status, created_at')
                .limit(5);

            report.rows = rows || [];

        } catch (e: any) {
            report.crash = e.message;
        }

        setStatus(report);
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Shield className="text-blue-600" />
                Blog System Diagnostics
            </h1>

            {loading ? (
                <div>Running checks...</div>
            ) : (
                <div className="space-y-6">
                    {/* Auth Status */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold flex items-center gap-2 mb-4">
                            <User size={20} className="text-gray-400" />
                            Authentication Status
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <StatusItem label="Is Logged In" value={status.auth.authenticated} />
                            <StatusItem label="User ID" value={status.auth.user} />
                        </div>
                        {!status.auth.authenticated && (
                            <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                                <X size={16} />
                                You are not logged in. This explains why you cannot see Admin posts.
                            </div>
                        )}
                    </div>

                    {/* Database Status */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold flex items-center gap-2 mb-4">
                            <Shield size={20} className="text-gray-400" />
                            Database Connection
                        </h3>
                        <div className="mb-4 p-3 bg-blue-50 text-blue-800 text-xs font-mono rounded-lg break-all">
                            Connected to: <strong>{process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1].split('.')[0]}</strong>
                            <br />
                            (Check if this matches your Supabase Dashboard URL)
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <StatusItem label="Table Access" value={status.db_auth.accessible} />
                            <StatusItem label="Total Posts Found" value={status.db_auth.count ?? 'Error'} />
                        </div>

                        {status.db_auth.force_error && (
                            <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                                <strong>Blocking Error Detected:</strong> {status.db_auth.force_error} ({status.db_auth.force_code})
                                <div className="mt-1 text-xs text-red-600">This confirms RLS is blocking you. Check your Supabase Policies.</div>
                            </div>
                        )}

                        {status.db_auth.error && (
                            <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                                <strong>Error:</strong> {status.db_auth.error} ({status.db_auth.code})
                                {status.db_auth.code === '42P01' && (
                                    <div className="mt-1 font-bold">MISSING TABLE detected. Please run the SQL setup.</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Recent Rows */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold flex items-center gap-2 mb-4">
                            <User size={20} className="text-gray-400" />
                            Recent Posts (Raw Data)
                        </h3>
                        {status.rows?.length === 0 ? (
                            <p className="text-gray-400 italic">No posts found in database.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="p-2">Title</th>
                                            <th className="p-2">Status</th>
                                            <th className="p-2">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {status.rows?.map((row: any) => (
                                            <tr key={row.id} className="border-t border-gray-100">
                                                <td className="p-2 font-medium">{row.title}</td>
                                                <td className="p-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs ${row.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="p-2 text-gray-500">{new Date(row.created_at).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusItem({ label, value }: { label: string, value: any }) {
    const isBool = typeof value === 'boolean';
    const display = isBool ? (value ? 'Yes' : 'No') : value;
    const color = isBool ? (value ? 'text-green-600' : 'text-red-600') : 'text-gray-900';
    const Icon = isBool ? (value ? Check : X) : null;

    return (
        <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{label}</div>
            <div className={`mt-1 font-mono text-sm flex items-center gap-2 ${color}`}>
                {Icon && <Icon size={14} />}
                {display}
            </div>
        </div>
    );
}
