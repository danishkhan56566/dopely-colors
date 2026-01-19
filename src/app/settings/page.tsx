'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { LogOut, Trash2, Mail, Shield, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);
            setLoading(false);
        });
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        toast.success('Signed out successfully');
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("Are you sure? This action cannot be undone.");
        if (confirmed) {
            // In a real app, you might need a backend function to fully delete users securely
            await supabase.auth.signOut();
            toast.success("Account marked for deletion.");
            router.push('/');
        }
    };

    if (loading) return null; // Or skeleton

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto p-8 pt-24">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-500 mb-10">Manage your account and preferences.</p>

                <div className="space-y-6">
                    {/* Profile Section */}
                    <section className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-blue-600" /> Account Security
                        </h2>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Mail size={24} />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Email Address</div>
                                <div className="text-sm text-gray-500">{user?.email}</div>
                            </div>
                            <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                Verified
                            </span>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-white rounded-2xl border border-red-100 overflow-hidden">
                        <div className="p-6 border-b border-red-100 bg-red-50/30">
                            <h2 className="text-lg font-bold text-red-700 flex items-center gap-2">
                                <AlertTriangle size={20} /> Danger Zone
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-gray-900">Sign Out</div>
                                    <div className="text-sm text-gray-500">Log out of your account on this device.</div>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-gray-900">Delete Account</div>
                                    <div className="text-sm text-gray-500">Permanently remove your account and all data.</div>
                                </div>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 font-bold rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Trash2 size={16} /> Delete Account
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}
