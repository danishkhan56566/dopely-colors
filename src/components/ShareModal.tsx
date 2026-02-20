'use client';

import { X, Globe, Lock, Copy, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePaletteStore, SavedPalette } from '@/store/usePaletteStore';
import { toast } from 'sonner';
import { createPortal } from 'react-dom';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    palette: SavedPalette;
}

export const ShareModal = ({ isOpen, onClose, palette }: ShareModalProps) => {
    const { updateVisibility } = usePaletteStore();
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen) return null;
    if (!mounted) return null;

    const isPublic = !!palette.is_public;
    const shareUrl = `${window.location.origin}/p/${palette.id}`;

    const handleToggle = async () => {
        setLoading(true);
        try {
            await updateVisibility(palette.id, !isPublic);
            toast.success(isPublic ? 'Palette is now private' : 'Palette is now public');
        } catch (error) {
            toast.error('Failed to update visibility');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!isPublic) {
            toast.error('Make the palette public to share it');
            return;
        }
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Link copied to clipboard');
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Share Palette</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Public Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPublic ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                {isPublic ? <Globe size={20} /> : <Lock size={20} />}
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">{isPublic ? 'Public Access' : 'Private'}</div>
                                <div className="text-xs text-gray-500">
                                    {isPublic ? 'Anyone with the link can view' : 'Only you can see this'}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleToggle}
                            disabled={loading}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isPublic ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {/* Link Section */}
                    <div className={`space-y-2 transition-opacity ${isPublic ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <label className="text-xs font-bold uppercase text-gray-500">Share Link</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none"
                            />
                            <button
                                onClick={handleCopy}
                                className="px-4 py-2 bg-black text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
