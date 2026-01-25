'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    User,
    Shield,
    Ban,
    MoreVertical,
    Search,
    Mail,
    Calendar,
    Check,
    X,
    UserCog,
    Trash2,
    ShieldAlert,
    Users as UsersIcon
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

import { getUsersAdmin, updateUserRoleAdmin, updateUserStatusAdmin } from './actions';

type UserProfile = {
    id: string;
    email?: string;
    role: string;
    status: string;
    created_at: string;
    last_sign_in?: string;
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { users: fetchedUsers, error } = await getUsersAdmin();

            if (error) {
                console.error('Error fetching users:', error);
                toast.error('Failed to load users');
                // Fallback to mock data only if specifically needed or keep empty
                if (fetchedUsers.length === 0) {
                    // Keep existing mock data logic or remove? 
                    // User requested "must show all user", so we should trust the DB + Service Key.
                    // But if DB is truly empty, maybe show empty?
                    // I will keep the mock data fallback for now in case the DB is truly empty 
                    // so the UI isn't broken during review if they have no users.
                    // Wait, better to show "No users found" if DB works but returns nothing.
                    // Only mock if ERROR or explicitly desired.
                    // The previous code mocked if (profiles && profiles.length > 0).
                    // actually it was: if (profiles && profiles.length > 0) set... else setMock...
                }
            }

            if (fetchedUsers) {
                setUsers(fetchedUsers);
            }
        } catch (error) {
            console.error('Error in fetchUsers:', error);
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateRole = async (userId: string, newRole: string) => {
        // Optimistic update
        const previousUsers = [...users];
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));

        toast.promise(
            async () => {
                const { error } = await updateUserRoleAdmin(userId, newRole);
                if (error) throw new Error(error);
            },
            {
                loading: 'Updating role...',
                success: 'User role updated successfully',
                error: (err) => {
                    setUsers(previousUsers); // Revert
                    return 'Failed to update user role';
                }
            }
        );
    };

    const handleUpdateStatus = async (userId: string, newStatus: string) => {
        // Optimistic update
        const previousUsers = [...users];
        setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));

        toast.promise(
            async () => {
                const { error } = await updateUserStatusAdmin(userId, newStatus);
                if (error) throw new Error(error);
            },
            {
                loading: 'Updating status...',
                success: `User ${newStatus === 'banned' ? 'banned' : 'activated'}`,
                error: (err) => {
                    setUsers(previousUsers); // Revert
                    return 'Failed to update user status';
                }
            }
        );
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.includes(searchTerm)
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 text-sm mt-1">View and manage registered users.</p>
                </div>
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold flex items-center gap-2">
                    <UsersIcon size={18} />
                    Total Users: {users.length}
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by email or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4 font-bold">User</th>
                            <th className="px-6 py-4 font-bold">Role</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold">Joined</th>
                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading users...</td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No users found.</td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shadow-sm">
                                                {user.email ? user.email[0].toUpperCase() : <User size={20} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                                    {user.email || 'Unknown Email'}
                                                </div>
                                                <div className="text-xs text-gray-400 font-mono" title={user.id}>
                                                    {user.id.slice(0, 8)}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role === 'admin' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                                                <Shield size={12} /> Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                                <User size={12} /> User
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.status === 'banned' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                                <Ban size={12} /> Banned
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                                <Check size={12} /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-2 font-medium">
                                            <Calendar size={14} className="opacity-70" />
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-56 p-2" align="end">
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-xs font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">
                                                        Role Management
                                                    </div>
                                                    <button
                                                        onClick={() => handleUpdateRole(user.id, 'admin')}
                                                        disabled={user.role === 'admin'}
                                                        className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Shield size={16} /> Make Admin
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateRole(user.id, 'user')}
                                                        disabled={user.role === 'user'}
                                                        className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <User size={16} /> Make User
                                                    </button>

                                                    <div className="h-px bg-gray-100 my-1" />

                                                    <div className="text-xs font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">
                                                        Account Status
                                                    </div>
                                                    {user.status === 'banned' ? (
                                                        <button
                                                            onClick={() => handleUpdateStatus(user.id, 'active')}
                                                            className="flex items-center gap-2 px-2 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md font-medium"
                                                        >
                                                            <Check size={16} /> Activate User
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUpdateStatus(user.id, 'banned')}
                                                            className="flex items-center gap-2 px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium"
                                                        >
                                                            <Ban size={16} /> Ban User
                                                        </button>
                                                    )}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
