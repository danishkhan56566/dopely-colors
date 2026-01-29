import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sparkles } from 'lucide-react';

export default function Loading() {
    return (
        <DashboardLayout>
            <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center px-4 overflow-hidden bg-neutral-50/50">
                {/* Background Elements Skeleton */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gray-200/50 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gray-200/50 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-6xl w-full flex flex-col items-center space-y-12 py-20 text-center">

                    {/* Badge Skeleton */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md border border-white/40 rounded-full h-8 w-48 animate-pulse" />

                    {/* Hero Text Skeleton */}
                    <div className="space-y-6 flex flex-col items-center w-full">
                        <div className="h-20 w-3/4 bg-gray-200/50 rounded-3xl animate-pulse" />
                        <div className="h-8 w-1/2 bg-gray-200/50 rounded-xl animate-pulse" />
                    </div>

                    {/* Input Skeleton */}
                    <div className="w-full max-w-2xl h-[100px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-2 border border-gray-100/50 flex items-center gap-4 px-6 animate-pulse">
                        <div className="w-6 h-6 bg-gray-200 rounded-full" />
                        <div className="flex-1 h-6 bg-gray-100 rounded-lg" />
                        <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
                    </div>

                    {/* Bento Grid Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl pt-20">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm p-8 flex flex-col gap-6 animate-pulse">
                                <div className="w-14 h-14 rounded-2xl bg-gray-100" />
                                <div className="space-y-3">
                                    <div className="h-8 w-3/4 bg-gray-100 rounded-lg" />
                                    <div className="h-4 w-full bg-gray-50 rounded-lg" />
                                    <div className="h-4 w-5/6 bg-gray-50 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
