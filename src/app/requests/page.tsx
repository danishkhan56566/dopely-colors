import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Lightbulb, ThumbsUp, MessageSquare } from 'lucide-react';

export default function RequestsPage() {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-4">Feature Requests</h1>
                    <p className="text-gray-500">Help shape the future of Dopley Colors. Vote on ideas or submit your own.</p>
                </div>

                <div className="grid gap-6">
                    {/* Mock Request Items */}
                    {[
                        { title: "Figma Plugin", votes: 428, desc: "A direct integration to sync palettes with Figma styles.", status: "In Progress" },
                        { title: "Adobe Swatch Exchange (.ase) Export", votes: 312, desc: "Export support for Adobe proprietary format.", status: "Planned" },
                        { title: "AI Palette from Text", votes: 89, desc: "Generate palettes from descriptive text prompts.", status: "Completed" },
                    ].map((req, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex gap-6 items-start hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center gap-1 min-w-[60px]">
                                <button className="w-12 h-12 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors">
                                    <ThumbsUp size={20} />
                                </button>
                                <span className="font-bold text-gray-900">{req.votes}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-lg">{req.title}</h3>
                                    {req.status === 'Completed' ? (
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Done</span>
                                    ) : req.status === 'In Progress' ? (
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Building</span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Planned</span>
                                    )}
                                </div>
                                <p className="text-gray-600 mb-4">{req.desc}</p>
                                <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900">
                                    <MessageSquare size={16} /> 12 Comments
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
                        Submit New Request
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
