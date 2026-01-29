'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Lock, MessageCircle } from 'lucide-react';

export default function AccessDenied() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-8 relative">
                <ShieldAlert size={48} strokeWidth={2.5} />
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Lock size={16} className="text-gray-900" />
                </div>
            </div>

            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Access Restricted</h1>
            <p className="max-w-md text-gray-500 font-medium mb-10 leading-relaxed">
                Your current role does not have the necessary permissions to access this administrative module.
                Please contact the system owner if you believe this is an error.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/admin/dashboard"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-xl active:scale-[0.98]"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>
                <button
                    onClick={() => window.alert("Access request sent to Super Admin.")}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-100 text-gray-900 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all shadow-sm"
                >
                    <MessageCircle size={18} className="text-blue-500" />
                    Request Permission
                </button>
            </div>

            <div className="mt-12 p-6 bg-gray-50/50 rounded-2xl border border-gray-50 max-w-sm">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Technical Details</div>
                <div className="text-[11px] font-mono text-gray-500 flex flex-col gap-1">
                    <span>Error Code: 403_FORBIDDEN_SCOPE</span>
                    <span>Required Level: 3 (Publisher)</span>
                    <span>Your Level: 2 (Editor)</span>
                </div>
            </div>
        </div>
    );
}
