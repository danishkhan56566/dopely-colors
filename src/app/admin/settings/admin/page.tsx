'use client';

import { useState, useEffect } from 'react';
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
    CheckCircle2,
    Check,
    X,
    User,
    Monitor,
    Smartphone,
    Globe,
    LogOut,
    Search,
    ChevronLeft,
    MoreVertical,
    CheckCircle,
    Info,
    Edit3,
    BarChart,
    Download
} from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { getAdminPermissions, updateAdminPermissions, getAuditLogs, logAdminAction, inviteAdmin, type FeaturePermissions, type PermissionGrade } from './actions';
import { getUsersAdmin, type AdminUser } from '../../users/actions';
import { format } from 'date-fns';

// Define Permissions State Typings
// Local UI types moved to actions.ts

export default function AdminSettingsAdmin() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingAdmins, setIsFetchingAdmins] = useState(true);
    const [activeTab, setActiveTab] = useState<'permissions' | 'security' | 'sessions' | 'audit'>('permissions');
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [selectedAdminIndex, setSelectedAdminIndex] = useState(0);
    const [showKey, setShowKey] = useState<Record<string, boolean>>({});
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [isFetchingLogs, setIsFetchingLogs] = useState(false);
    const [auditError, setAuditError] = useState<string | null>(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    const [adminSettings, setAdminSettings] = useState({
        googleApiKey: 'AIzaSyDD0I9y6QrlJlhGVx8bINwTUJonZUs5YOE',
        supabaseServiceKey: '••••••••••••••••••••••••••••••••',
        requireTwoFactor: true,
        sessionTimeout: 60,
        allowSocialAdmin: false
    });

    // RBAC Initial State
    const [permissions, setPermissions] = useState<FeaturePermissions>({
        'AI Palette Generator': { view: true, edit: true, publish: true },
        'Blog Section': { view: true, edit: true, publish: false },
        'Color Palettes Library': { view: true, edit: true, publish: true },
        'Gradients Library': { view: true, edit: true, publish: false },
        'Bulk Upload': { view: true, edit: true, publish: false },
        'Inbox & Support': { view: true, edit: true, publish: false },
        'Design System Builder': { view: true, edit: true, publish: false },
    });

    // Fetch admins and logs on mount
    useEffect(() => {
        fetchAdmins();
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setIsFetchingLogs(true);
        setAuditError(null);
        const { logs, error } = await getAuditLogs();
        if (error) {
            setAuditError(error);
        } else {
            setAuditLogs(logs);
        }
        setIsFetchingLogs(false);
    };

    const fetchAdmins = async () => {
        setIsFetchingAdmins(true);
        const { users, error } = await getUsersAdmin();
        if (error) {
            toast.error('Failed to load admin users');
        } else {
            const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'editor');
            setAdmins(adminUsers);
            if (adminUsers.length > 0) fetchPermissions(adminUsers[0].id);
        }
        setIsFetchingAdmins(false);
    };

    const fetchPermissions = async (userId: string) => {
        const { permissions: fetchedPermissions, error } = await getAdminPermissions(userId);
        if (error) {
            toast.error('Failed to load permissions');
        } else if (fetchedPermissions) {
            setPermissions(fetchedPermissions);
        } else {
            setPermissions({
                'AI Palette Generator': { view: true, edit: false, publish: false },
                'Blog Section': { view: true, edit: false, publish: false },
                'Color Palettes Library': { view: true, edit: false, publish: false },
                'Gradients Library': { view: true, edit: false, publish: false },
                'Bulk Upload': { view: false, edit: false, publish: false },
                'Inbox & Support': { view: false, edit: false, publish: false },
                'Design System Builder': { view: false, edit: false, publish: false },
            });
        }
    };

    useEffect(() => {
        if (admins[selectedAdminIndex]) {
            fetchPermissions(admins[selectedAdminIndex].id);
        }
    }, [selectedAdminIndex, admins]);

    const features = Object.keys(permissions);

    const togglePermission = (feature: string, grade: keyof PermissionGrade) => {
        setPermissions(prev => ({
            ...prev,
            [feature]: {
                ...prev[feature],
                [grade]: !prev[feature][grade]
            }
        }));
    };

    const handleSave = async () => {
        if (!admins[selectedAdminIndex]) return;
        setIsLoading(true);
        const { success, error } = await updateAdminPermissions(admins[selectedAdminIndex].id, permissions);
        if (success) {
            toast.success(`Permissions for ${admins[selectedAdminIndex].email} synced successfully`);

            // Log the action (Server will auto-detect current user email)
            await logAdminAction({
                action: 'Update Permissions',
                details: `Modified RBAC matrix for ${admins[selectedAdminIndex].email}`,
                payload: permissions,
                context: 'RBAC Sync'
            });
            fetchLogs(); // Refresh logs
        } else {
            toast.error(error || 'Failed to sync permissions');
        }
        setIsLoading(false);
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;

        setIsLoading(true);
        const { success, error } = await inviteAdmin(inviteEmail, 'editor');
        if (success) {
            toast.success(`Invitation sent to ${inviteEmail}`);
            setInviteEmail('');
            setIsInviteModalOpen(false);
            fetchAdmins(); // Refresh admin list
            fetchLogs(); // Refresh logs
        } else {
            toast.error(error || 'Failed to send invitation');
        }
        setIsLoading(false);
    };

    const activeSessions = [
        { device: 'MacBook Pro 16"', browser: 'Chrome', ip: '192.168.1.1', location: 'Dubai, UAE', current: true },
        { device: 'iPhone 15 Pro', browser: 'Safari', ip: '102.34.11.9', location: 'London, UK', current: false },
    ];

    return (
        <div className="max-w-7xl mx-auto pb-24">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Shield className="text-violet-600" size={40} strokeWidth={2.5} />
                        Admin Authority
                    </h1>
                    <p className="text-gray-500 font-medium mt-1.5 flex items-center gap-2">
                        System configuration for roles, credentials, and live sessions.
                        <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">Secured</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5">
                        {[
                            { id: 'permissions', label: 'RBAC', icon: Settings },
                            { id: 'security', label: 'Secrets', icon: Key },
                            { id: 'sessions', label: 'Sessions', icon: Monitor },
                            { id: 'audit', label: 'Logs', icon: Info },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                                    activeTab === tab.id ? "bg-gray-900 text-white shadow-xl" : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* TAB: RBAC Permissions (The main request) */}
            {activeTab === 'permissions' && (
                <div className="grid lg:grid-cols-[320px_1fr] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* User Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden sticky top-8">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <Search size={18} className="text-gray-400" />
                                <MoreVertical size={18} className="text-gray-400 cursor-pointer" />
                            </div>
                            <div className="p-4 space-y-2">
                                {admins.map((admin, idx) => (
                                    <button
                                        key={admin.id}
                                        onClick={() => setSelectedAdminIndex(idx)}
                                        className={clsx(
                                            "w-full flex items-center gap-4 p-4 rounded-3xl transition-all text-left",
                                            selectedAdminIndex === idx
                                                ? "bg-slate-900 text-white shadow-2xl scale-[1.02]"
                                                : "hover:bg-gray-50 text-gray-900"
                                        )}
                                    >
                                        <div className={clsx(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                                            selectedAdminIndex === idx ? "bg-violet-500" : "bg-gray-100 text-gray-400"
                                        )}>
                                            {(admin.email || '?')[0].toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-sm truncate">{admin.email}</div>
                                            <div className={clsx(
                                                "text-[10px] font-black uppercase tracking-widest",
                                                selectedAdminIndex === idx ? "text-violet-400" : "text-gray-400"
                                            )}>
                                                {admin.role}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="p-6 bg-gray-50/50 border-t border-gray-50">
                                <button
                                    onClick={() => setIsInviteModalOpen(true)}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all shadow-sm disabled:opacity-50"
                                >
                                    <UserPlus size={16} />
                                    Invite New Editor
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Permissions Matrix Area */}
                    <div className="space-y-8">
                        {/* THE DARK PERMISSIONS BOX (Matching Image) */}
                        <section className="bg-slate-900 rounded-[3rem] shadow-2xl p-10 text-white overflow-hidden relative border border-white/5">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[80px] -z-10" />

                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">Feature Access Control</h2>
                                    <p className="text-slate-400 text-sm mt-1">Define granular lifecycle permissions for <span className="text-violet-400 font-black">{admins[selectedAdminIndex]?.email || 'User'}</span></p>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">
                                    <Shield size={14} /> Active Mode
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                            <th className="pb-6 w-1/3">Feature Set</th>
                                            <th className="pb-6 text-center"><div className="flex items-center justify-center gap-2"><Eye size={14} /> View</div></th>
                                            <th className="pb-6 text-center"><div className="flex items-center justify-center gap-2"><Edit3 size={14} /> Edit & Create</div></th>
                                            <th className="pb-6 text-center"><div className="flex items-center justify-center gap-2"><Lock size={14} /> Publish & Approve</div></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {features.map((feature) => (
                                            <tr key={feature} className="group">
                                                <td className="py-6 pr-6">
                                                    <div className="font-bold text-slate-100 text-sm">{feature}</div>
                                                    <div className="text-[10px] text-slate-500 font-medium">Domain: {feature.split(' ')[0]}</div>
                                                </td>

                                                {/* View */}
                                                <td className="py-6 text-center">
                                                    <PermissionToggle
                                                        active={permissions[feature].view}
                                                        onClick={() => togglePermission(feature, 'view')}
                                                    />
                                                </td>

                                                {/* Edit */}
                                                <td className="py-6 text-center">
                                                    <PermissionToggle
                                                        active={permissions[feature].edit}
                                                        onClick={() => togglePermission(feature, 'edit')}
                                                    />
                                                </td>

                                                {/* Publish */}
                                                <td className="py-6 text-center">
                                                    <PermissionToggle
                                                        active={permissions[feature].publish}
                                                        onClick={() => togglePermission(feature, 'publish')}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Actions */}
                            <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
                                <button
                                    onClick={handleSave}
                                    className="px-10 py-4 bg-violet-600 hover:bg-violet-700 rounded-2xl font-black text-sm shadow-xl shadow-violet-600/20 active:scale-95 transition-all outline-none"
                                >
                                    Save System State
                                </button>
                                <button className="px-10 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-sm text-slate-300 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </section>

                        {/* Extra Controls specifically for Blog */}
                        {features.includes('Blog Section') && (
                            <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                        <BarChart size={18} />
                                    </div>
                                    Specialized Blog Scope
                                </h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Restricted Categories</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Tutorials', 'Color Theory', 'Industry News', 'Company Announcements'].map(cat => (
                                                <button key={cat} className="px-4 py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 flex items-center gap-2">
                                                    {cat} <CheckCircle size={14} className="text-emerald-500" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Publication Policy</label>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                                                <div className="w-3 h-3 rounded-full bg-violet-600" />
                                                <span className="text-xs font-bold text-gray-700 italic">Self-publish enabled for "Tutorials"</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                                <span className="text-xs font-bold text-gray-700">Can request review for all tiers</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            )}

            {/* TAB: API Secrets & Security */}
            {activeTab === 'security' && (
                <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Key className="text-amber-500" size={22} />
                                    API Credentials
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Manage external service integrations and secret keys.</p>
                            </div>

                            <div className="p-8 space-y-6">
                                <CredentialInput
                                    label="Google (Gemini) API Key"
                                    value={adminSettings.googleApiKey}
                                    visible={showKey['google']}
                                    onToggle={() => setShowKey(prev => ({ ...prev, google: !prev.google }))}
                                    info="Powers the Neural Blog Writer and AI Color Assistant."
                                />
                                <CredentialInput
                                    label="Supabase Service Role Key"
                                    value={adminSettings.supabaseServiceKey}
                                    visible={showKey['supabase']}
                                    onToggle={() => setShowKey(prev => ({ ...prev, supabase: !prev.supabase }))}
                                    info="Used for administrative operations and bulk data syncing."
                                />
                            </div>
                            <div className="p-8 bg-amber-50/50 border-t border-amber-50 italic text-[11px] text-amber-700 font-medium">
                                Warning: Exposing these keys compromises the entire design environment.
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <section className="bg-gradient-to-br from-gray-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Lock className="text-violet-400" size={20} />
                                Security Protocol
                            </h3>

                            <div className="space-y-6">
                                <SecurityToggle
                                    label="Two-Factor Auth"
                                    desc="Strict mode for all Admins"
                                    active={adminSettings.requireTwoFactor}
                                    onClick={() => setAdminSettings({ ...adminSettings, requireTwoFactor: !adminSettings.requireTwoFactor })}
                                />
                                <SecurityToggle
                                    label="Social Login"
                                    desc="Allow Google Login"
                                    active={adminSettings.allowSocialAdmin}
                                    onClick={() => setAdminSettings({ ...adminSettings, allowSocialAdmin: !adminSettings.allowSocialAdmin })}
                                />

                                <div className="pt-4 border-t border-white/10">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Inactivity Timeout (m)</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="15"
                                            max="240"
                                            step="15"
                                            value={adminSettings.sessionTimeout}
                                            onChange={(e) => setAdminSettings({ ...adminSettings, sessionTimeout: parseInt(e.target.value) })}
                                            className="flex-1 accent-violet-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                                        />
                                        <span className="text-sm font-mono text-violet-400">{adminSettings.sessionTimeout}m</span>
                                    </div>
                                </div>
                                <button className="w-full mt-4 py-4 bg-violet-600 rounded-2xl font-black text-sm hover:brightness-110 transition-all shadow-xl">Update Global Policy</button>
                            </div>
                        </section>
                    </div>
                </div>
            )}

            {/* TAB: Session Management */}
            {activeTab === 'sessions' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Active Admin Sessions</h2>
                                <p className="text-sm text-gray-500 mt-1">Authorized devices currently connected to the dashboard.</p>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all">
                                <X size={16} /> Terminate All Other Sessions
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            {activeSessions.map((session, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-400">
                                            {session.device.includes('iPhone') ? <Smartphone size={24} /> : <Monitor size={24} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-gray-900">{session.device}</span>
                                                {session.current && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg text-[10px] uppercase font-black tracking-widest">This Device</span>}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                                                <span className="font-bold">{session.browser}</span>
                                                <span>•</span>
                                                <span>{session.ip}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 text-gray-400"><Globe size={12} /> {session.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {!session.current && (
                                        <button className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Remote Logout">
                                            <LogOut size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {/* TAB: Audit Logs */}
            {activeTab === 'audit' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">System Audit Log</h2>
                                <p className="text-sm text-gray-500 mt-1">Immutable trace of all administrative mutations.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-5 py-3 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all">
                                    <Download size={14} /> Export CSV
                                </button>
                                <button className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg shadow-gray-900/10">
                                    Full History
                                </button>
                            </div>
                        </div>

                        <div className="p-0 overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <th className="px-8 py-5 text-left">Timestamp</th>
                                        <th className="px-6 py-5 text-left">Operator</th>
                                        <th className="px-6 py-5 text-left">Action</th>
                                        <th className="px-6 py-5 text-left">Payload / Diff</th>
                                        <th className="px-8 py-5 text-right">Context</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {isFetchingLogs ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <RefreshCw size={24} className="animate-spin text-violet-500" />
                                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Syncing History...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : auditError ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <AlertTriangle size={32} className="text-amber-500" />
                                                    <div className="text-sm font-bold text-gray-900">{auditError}</div>
                                                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                                                        The `audit_logs` table needs to be created in your Supabase database.
                                                        Please run the migration located in <code className="bg-gray-100 px-1 py-0.5 rounded">supabase/migrations</code>.
                                                    </p>
                                                    <button
                                                        onClick={fetchLogs}
                                                        className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                                                    >
                                                        Retry Connection
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : auditLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center text-gray-400 text-xs font-bold italic">
                                                No administrative actions recorded yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        auditLogs.map((log, i) => (
                                            <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-5 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                                                    {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm')}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-[10px] font-black">
                                                            {(log.operator_email || 'S').charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-900 truncate max-w-[150px]" title={log.operator_email}>
                                                            {log.operator_email || 'System'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-xs font-black uppercase text-violet-500 tracking-wider whitespace-nowrap">{log.action}</td>
                                                <td className="px-6 py-5 text-xs text-gray-600 font-medium max-w-xs truncate">{log.details}</td>
                                                <td className="px-8 py-5 text-right font-bold text-[10px] text-gray-400 uppercase tracking-widest">{log.context || 'System'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}
            {/* Invitation Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <UserPlus className="text-violet-600" size={24} />
                                Invite Editor
                            </h3>
                            <button
                                onClick={() => setIsInviteModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleInvite} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="editor@dopleycolors.com"
                                    className="w-full bg-gray-50 px-5 py-4 rounded-2xl border border-gray-200 font-medium text-sm focus:ring-2 focus:ring-violet-100 transition-all outline-none"
                                />
                            </div>
                            <div className="p-4 bg-violet-50 rounded-2xl flex gap-3">
                                <Info size={18} className="text-violet-600 shrink-0" />
                                <p className="text-[11px] text-violet-600 font-medium leading-relaxed">
                                    Invitations grant immediate "Editor" access. You can customize granular permissions in the RBAC tab after they accept.
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-gray-900/10 disabled:opacity-50"
                            >
                                {isLoading ? <RefreshCw className="animate-spin mx-auto" size={20} /> : 'Send Magic Invite'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// UI HELPER COMPONENTS
function PermissionToggle({ active, onClick }: { active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                active
                    ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "bg-slate-800 text-slate-600 border border-slate-700/50"
            )}
        >
            {active ? <Check size={16} strokeWidth={4} /> : <X size={16} strokeWidth={4} />}
        </button>
    );
}

function CredentialInput({ label, value, visible, onToggle, info }: any) {
    return (
        <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">{label}</label>
            <div className="relative group">
                <input
                    type={visible ? 'text' : 'password'}
                    value={value}
                    readOnly
                    className="w-full bg-gray-50 px-5 py-4 rounded-2xl border border-gray-200 font-mono text-sm focus:ring-2 focus:ring-violet-100 transition-all outline-none"
                />
                <button
                    onClick={onToggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-violet-600 transition-colors"
                >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {info && (
                <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5 px-1">
                    <AlertTriangle size={12} className="text-amber-500" />
                    {info}
                </p>
            )}
        </div>
    );
}

function SecurityToggle({ label, desc, active, onClick }: any) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <div className="text-sm font-bold">{label}</div>
                <div className="text-[10px] text-gray-400">{desc}</div>
            </div>
            <button
                onClick={onClick}
                className={clsx(
                    "w-11 h-6 rounded-full transition-colors relative",
                    active ? "bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.5)]" : "bg-white/10"
                )}
            >
                <div className={clsx("absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md", active ? "left-6" : "left-1")} />
            </button>
        </div>
    );
}
