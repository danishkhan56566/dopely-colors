'use client';

import { ArrowRight, Wrench } from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '../layout/DashboardLayout';

interface ToolPageProps {
    title: string;
    description: string;
    actionLabel?: string;
    actionLink?: string;
}

export const ToolPlaceholder = ({ title, description, actionLabel = "Try Generator instead", actionLink = "/generate" }: ToolPageProps) => {
    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <Wrench size={32} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
                <p className="text-xl text-gray-500 max-w-lg mb-8">{description}</p>
                <Link
                    href={actionLink}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                    {actionLabel} <ArrowRight size={18} />
                </Link>
            </div>
        </DashboardLayout>
    );
};
