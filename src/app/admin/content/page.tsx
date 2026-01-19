'use client';

import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

const MOCK_POSTS = [
    { id: 1, title: 'Mastering Color Theory in 2026', category: 'Color Theory', status: 'Published', date: 'Jan 10, 2026', views: 1240 },
    { id: 2, title: 'Accessibility First Design', category: 'Accessibility', status: 'Published', date: 'Jan 05, 2026', views: 856 },
    { id: 3, title: 'Tailwind CSS Tips & Tricks', category: 'Development', status: 'Draft', date: 'Jan 17, 2026', views: 0 },
];

export default function ContentManagement() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Content Manager</h1>
                <button className="bg-black text-white px-4 py-2 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2">
                    <Plus size={18} />
                    New Article
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Blog Posts</h2>
                    <div className="text-sm text-gray-500">Manage your articles and tutorials</div>
                </div>

                <div className="divide-y divide-gray-50">
                    {MOCK_POSTS.map((post) => (
                        <div key={post.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{post.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 text-xs font-bold uppercase">{post.category}</span>
                                    <span>{post.date}</span>
                                    <span className="flex items-center gap-1"><Eye size={12} /> {post.views}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {post.status}
                                </span>
                                <div className="flex items-center gap-2 pl-4 border-l border-gray-100">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
