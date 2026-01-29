'use client';

import { useState } from 'react';
import {
    Shield,
    Key,
    Lock,
    UserPlus,
    Settings,
    Eye,
    EyeOff,
    RefreshCw,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

export default function AdminSettingsAdmin() {
    const [isLoading, setIsLoading] = useState(false);
    const [showKey, setShowKey] = useState<Record<string, boolean>>({});

    const [adminSettings, setAdminSettings] = useState({
        googleApiKey: 'AIzaSyDD0I9y6QrlJlhGVx8bINwTUJonZUs5YOE', // Masked or partial
        supabaseServiceKey: '••••••••••••••••••••••••••••••••',
        requireTwoFactor: true,
        sessionTimeout: 60, // Minutes
        allowSocialAdmin: false
    });

    const toggleKeyVisibility = (key: string) => {
        setShowKey(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Admin security settings updated successfully');
        }, 1500);
    };

    const admins = [
        { id: 1, name: 'Danish Khan', email: 'danish@example.com', role: 'Super Admin', status: 'Active', lastActive: '2 mins ago' },
        { id: 2, name: 'Support lead', email: 'support@dopely.com', role: 'Editor', status: 'Active', lastActive: '5 hours ago' },
        { id: 3, name: 'Dev Bot', email: 'ai@dopely.com', role: 'System', status: 'Active', lastActive: 'Just now' },
    ];

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Shield className="text-blue-600" size={32} />
                        Admin Security & Access
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Configure backend API keys, admin roles, and security protocols.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className={clsx(
                        "flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white transition-all shadow-xl",
                        isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-95"
                    )}
                >
                    {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <Lock size={20} />}
                    {isLoading ? 'Encrypting...' : 'Secure & Save'}
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Settings column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* API Credentials */}
                    <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Key className="text-amber-500" size={22} />
                                API Credentials
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Manage external service integrations and secret keys.</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Google (Gemini) API Key</label>
                                <div className="relative group">
                                    <input
                                        type={showKey['google'] ? 'text' : 'password'}
                                        value={adminSettings.googleApiKey}
                                        readOnly
                                        className="w-full bg-gray-50 px-5 py-4 rounded-2xl border border-gray-200 font-mono text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                    />
                                    <button
                                        onClick={() => toggleKeyVisibility('google')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        {showKey['google'] ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5 px-1">
                                    <AlertTriangle size={12} className="text-amber-400" />
                                    This key powers the Neural Blog Writer and AI Color Assistant.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Supabase Service Role Key</label>
                                <div className="relative group">
                                    <input
                                        type={showKey['supabase'] ? 'text' : 'password'}
                                        value={adminSettings.supabaseServiceKey}
                                        readOnly
                                        className="w-full bg-gray-50 px-5 py-4 rounded-2xl border border-gray-200 font-mono text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                    />
                                    <button
                                        onClick={() => toggleKeyVisibility('supabase')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        {showKey['supabase'] ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Admin Users Table */}
                    <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Privileged Accounts</h2>
                                <p className="text-sm text-gray-500 mt-1">Users with access to the Admin Console.</p>
                            </div>
                            <button className="p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95">
                                <UserPlus size={20} />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <th className="px-8 py-4">Admin Name</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Activity</th>
                                        <th className="px-8 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {admins.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                                        {admin.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{admin.name}</div>
                                                        <div className="text-xs text-gray-500">{admin.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={clsx(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                    admin.role === 'Super Admin' ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                                                )}>
                                                    {admin.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                    {admin.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs font-medium text-gray-400 italic">{admin.lastActive}</span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest">Revoke</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Right Sidebar - Security Policies */}
                <div className="space-y-8">
                    <section className="bg-gradient-to-br from-gray-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-2xl">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Shield className="text-blue-400" size={20} />
                            Security Protocol
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold">Two-Factor Auth</div>
                                    <div className="text-[10px] text-gray-400">Strict mode for all Admins</div>
                                </div>
                                <button
                                    onClick={() => setAdminSettings({ ...adminSettings, requireTwoFactor: !adminSettings.requireTwoFactor })}
                                    className={clsx(
                                        "w-11 h-6 rounded-full transition-colors relative",
                                        adminSettings.requireTwoFactor ? "bg-blue-500" : "bg-white/10"
                                    )}
                                >
                                    <div className={clsx("absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md", adminSettings.requireTwoFactor ? "left-6" : "left-1")} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold">Social Login</div>
                                    <div className="text-[10px] text-gray-400">Allow Admin login via Google</div>
                                </div>
                                <button
                                    onClick={() => setAdminSettings({ ...adminSettings, allowSocialAdmin: !adminSettings.allowSocialAdmin })}
                                    className={clsx(
                                        "w-11 h-6 rounded-full transition-colors relative",
                                        adminSettings.allowSocialAdmin ? "bg-blue-500" : "bg-white/10"
                                    )}
                                >
                                    <div className={clsx("absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md", adminSettings.allowSocialAdmin ? "left-6" : "left-1")} />
                                </button>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Inactivity Timeout</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="15"
                                        max="240"
                                        step="15"
                                        value={adminSettings.sessionTimeout}
                                        onChange={(e) => setAdminSettings({ ...adminSettings, sessionTimeout: parseInt(e.target.value) })}
                                        className="flex-1 accent-blue-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                                    />
                                    <span className="text-sm font-mono text-blue-400">{adminSettings.sessionTimeout}m</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Recent Audit Log</h3>
                        <div className="space-y-4">
                            {[
                                { event: 'Key Updated', user: 'danish', time: '1h' },
                                { event: 'Login Success', user: 'support', time: '5h' },
                                { event: 'Policy Change', user: 'system', time: '12h' },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <div className="text-xs">
                                            <span className="font-bold text-gray-900">{log.event}</span>
                                            <span className="text-gray-400"> by </span>
                                            <span className="font-semibold text-gray-600">{log.user}</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-400">{log.time}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2.5 bg-gray-50 text-gray-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-all">
                            View Full History
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}
