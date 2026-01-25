'use client';

import { useState } from 'react';
import { generateDailyBatch } from './actions';
import { toast } from 'sonner';
import { Loader2, Wand2, Zap, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DailyGeneratorPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastResult, setLastResult] = useState<{ count?: number, time?: string } | null>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const start = Date.now();
            const result = await generateDailyBatch(100);

            if (result.error) {
                toast.error('Generation Failed', { description: result.error });
            } else {
                const duration = ((Date.now() - start) / 1000).toFixed(1);
                setLastResult({ count: result.count, time: duration });
                toast.success(`Success! Generated ${result.count} palettes in ${duration}s.`);
            }
        } catch (err: any) {
            toast.error('Error', { description: err.message });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-lg">
                        <Calendar size={24} />
                    </span>
                    Daily AI Generator
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    Automated Color Theory Engine. Generates 100 high-quality palettes based on existing database trends.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Control Card */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wand2 size={120} />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-4">Manual Trigger</h2>
                        <p className="text-gray-500 mb-8">
                            Click below to immediately generate and publish a new batch of 100 palettes.
                            They will be marked as "Daily AI" and published instantly.
                        </p>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="animate-spin" /> crunching numbers...
                                </>
                            ) : (
                                <>
                                    <Zap className="text-yellow-400 fill-yellow-400" /> Generate 100 Palettes
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Status Card */}
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900 mb-4">Last Run Status</h3>

                    {lastResult ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xl">
                                    ✓
                                </div>
                                <div>
                                    <div className="font-bold text-2xl">{lastResult.count}</div>
                                    <div className="text-sm text-gray-500">Palettes Created</div>
                                </div>
                            </div>
                            <div className="text-sm bg-white p-3 rounded-lg border border-gray-200 inline-block">
                                ⏱️ Performance: <strong>{lastResult.time}s</strong>
                            </div>
                            <div className="pt-4">
                                <Link
                                    href="/admin/palettes"
                                    className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                                >
                                    View in Palettes Manager <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            No runs this session.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
