import { X, RefreshCcw, Lock, Sparkles } from 'lucide-react';

interface HowItWorksModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HowItWorksModal = ({ isOpen, onClose }: HowItWorksModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">How it Works</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 md:p-8 flex flex-col gap-8">
                    {/* Step 1 */}
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <RefreshCcw size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">1. Generate</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Press <kbd className="px-2 py-0.5 bg-gray-100 rounded text-gray-800 text-xs font-bold border border-gray-200">Spacebar</kbd> (or click Generate) to shuffle colors.
                                The AI finds harmonious combinations instantly.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">2. Lock</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Click the <strong>Lock icon</strong> on any color you love.
                                It will stay fixed while other colors update around it.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">3. Refine</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Keep generating until you have the perfect palette!
                                The algorithm always respects your locked choices.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};
