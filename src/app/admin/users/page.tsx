'use client';

import { Search, MoreVertical, Shield, Ban, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const MOCK_USERS = [
    { id: 1, name: 'Alice Cooper', email: 'alice@example.com', role: 'admin', status: 'active', joined: 'Jan 12, 2026' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'pro', status: 'active', joined: 'Jan 15, 2026' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'user', status: 'inactive', joined: 'Jan 10, 2026' },
    { id: 4, name: 'David Lee', email: 'david@example.com', role: 'user', status: 'banned', joined: 'Dec 05, 2025' },
    { id: 5, name: 'Eve Wilson', email: 'eve@example.com', role: 'pro', status: 'active', joined: 'Jan 18, 2026' },
];

export default function UserManagement() {
    const [search, setSearch] = useState('');

    const filteredUsers = MOCK_USERS.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'pro' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {user.status === 'active' && <CheckCircle size={14} className="text-green-500" />}
                                        {user.status === 'banned' && <Ban size={14} className="text-red-500" />}
                                        <span className={`text-sm ${user.status === 'active' ? 'text-green-700' :
                                                user.status === 'banned' ? 'text-red-700' :
                                                    'text-gray-500'
                                            }`}>
                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {user.joined}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
