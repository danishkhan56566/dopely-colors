'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Trash2, Check, Clock, User, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getMessagesAdmin, updateMessageStatusAdmin, deleteMessageAdmin, checkSupabaseConnection, AdminMessage } from './actions';

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<AdminMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    console.log('AdminMessagesPage Mounted');

    const testConnection = async () => {
        toast.promise(
            (async () => {
                const result: any = await checkSupabaseConnection();
                if (result.error) throw new Error(result.error);
                if (result.readError) throw new Error('Read Failed: ' + result.readError);
                if (result.insertError) throw new Error('Insert Failed: ' + result.insertError);
                return `Connected! Found ${result.count} msgs. Inserted ID: ${result.insertId}`;
            })(),
            {
                loading: 'Testing DB Connection...',
                success: (data) => data,
                error: (err: any) => `Connection Error: ${err.message}`
            }
        );
    };

    const fetchMessages = async () => {
        console.log('Calling fetchMessages with filter:', filter);
        setIsLoading(true);
        try {
            // 1. Auth Check (Client Side UI Gate)
            // 1. Auth Check (Client Side UI Gate)
            const authRes = await supabase.auth.getUser();

            if (!authRes.data?.user) {
                if (!authRes.error) {
                    window.location.href = '/login';
                }
                setIsLoading(false);
                return;
            }

            // 2. Data Fetch via Server Action (Bypassing RLS)
            const result = await getMessagesAdmin(filter);

            console.log('Fetch Result RAW:', result);

            if (result.error) {
                console.error('Fetch Result ERROR:', result.error);
                throw new Error(result.error);
            }

            console.log('Setting messages:', result.messages);
            setMessages(result.messages || []);
        } catch (err: any) {
            console.error('Inbox Fetch Error:', err);
            toast.error(err.message || 'Failed to load messages');
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
        fetchMessages();
    }, [filter]);

    const markAsRead = async (id: string) => {
        try {
            const result = await updateMessageStatusAdmin(id, 'read');
            if (result.error) throw new Error(result.error);

            setMessages(prev => prev.map(msg =>
                msg.id === id ? { ...msg, status: 'read' } : msg
            ));
            toast.success('Marked as read');
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const result = await deleteMessageAdmin(id);
            if (result.error) throw new Error(result.error);

            setMessages(prev => prev.filter(msg => msg.id !== id));
            toast.success('Message deleted');
        } catch (err) {
            toast.error('Failed to delete message');
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
                    <p className="text-gray-500 mt-1">Manage contact form submissions.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={testConnection} className="px-3 py-1.5 rounded-md text-xs font-bold bg-gray-800 text-white hover:bg-black transition-colors self-center">
                        Debug DB
                    </button>
                    <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${filter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${filter === 'unread' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Unread
                        </button>
                    </div>
                </div>
            </div>

            {/* RAW DATA DUMP FOR DEBUGGING */}
            <div className="bg-black text-green-400 p-4 rounded mb-8 text-xs font-mono overflow-auto max-h-40">
                <strong>DEBUG RAW STATE:</strong>
                <pre>{JSON.stringify(messages, null, 2)}</pre>
            </div>

            {isLoading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading inbox...</p>
                </div>
            ) : messages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Mail size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Inbox is empty</h3>
                    <p className="text-gray-500">No messages found matching your filter.</p>
                    <button onClick={() => fetchMessages()} className="mt-4 text-blue-600 font-bold hover:underline flex items-center justify-center gap-2">
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`bg-white rounded-2xl border p-6 transition-all ${msg.status === 'unread' ? 'border-blue-200 shadow-sm ring-1 ring-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${msg.status === 'unread' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {msg.first_name?.[0] || 'U'}{msg.last_name?.[0] || ''}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">
                                            {msg.first_name} {msg.last_name}
                                            {msg.status === 'unread' && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">New</span>}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                            <span className="hover:text-blue-600 cursor-pointer" onClick={() => window.location.href = `mailto:${msg.email}`}>{msg.email}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1"><Clock size={12} /> {new Date(msg.created_at).toLocaleDateString()} at {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {msg.status === 'unread' && (
                                        <button
                                            onClick={() => markAsRead(msg.id)}
                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Mark as Read"
                                        >
                                            <Check size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteMessage(msg.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
