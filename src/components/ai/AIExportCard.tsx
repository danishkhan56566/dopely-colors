'use client';

import {
    Figma, FileCode, Code2, Download, Copy, Check
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DesignState } from '@/lib/ai-assistant';
import {
    mapDesignStateToExport,
    generateFigmaExport,
    generateCSSExport,
    generateTailwindExport,
    generateAndroidExport,
    generateIOSExport,
    downloadFile
} from '@/lib/export-system';

interface AIExportCardProps {
    design: DesignState;
}

export const AIExportCard = ({ design }: AIExportCardProps) => {
    const [selected, setSelected] = useState<'figma' | 'css' | 'tailwind' | 'android' | 'ios' | null>(null);
    const exportData = mapDesignStateToExport(design);

    const handleCopy = (type: 'css' | 'tailwind') => {
        let content = '';
        if (type === 'css') content = generateCSSExport(exportData);
        if (type === 'tailwind') content = generateTailwindExport(exportData);

        navigator.clipboard.writeText(content);
        toast.success(`Copied ${type === 'css' ? 'CSS' : 'Tailwind config'} to clipboard`);
    };

    const handleDownload = (type: 'figma' | 'css' | 'tailwind' | 'android' | 'ios') => {
        if (type === 'figma') {
            const content = JSON.stringify(generateFigmaExport(exportData), null, 2);
            downloadFile(content, 'dopely-design-system.json', 'json');
            toast.success('Figma JSON downloaded');
        } else if (type === 'css') {
            const content = generateCSSExport(exportData);
            downloadFile(content, 'dopely-colors.css', 'css');
            toast.success('CSS file downloaded');
        } else if (type === 'tailwind') {
            const content = generateTailwindExport(exportData);
            downloadFile(content, 'tailwind.config.js', 'js');
            toast.success('Tailwind config downloaded');
        } else if (type === 'android') {
            const content = generateAndroidExport(exportData);
            downloadFile(content, 'colors.xml', 'xml');
            toast.success('Android XML downloaded');
        } else if (type === 'ios') {
            const content = generateIOSExport(exportData);
            downloadFile(content, 'Colors.swift', 'swift');
            toast.success('iOS Swift downloaded');
        }
    };

    const handleExportSelected = () => {
        if (selected) handleDownload(selected);
        else toast.error("Please select a format");
    };

    return (
        <div className="w-full bg-white rounded-3xl shadow-xl border border-violet-100 overflow-hidden mt-4">

            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 text-white text-center">
                <div className="inline-flex p-3 bg-white/20 rounded-full mb-4 backdrop-blur-sm shadow-lg">
                    <Download size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-black mb-1">Export Design System</h3>
                <p className="text-violet-100 text-sm opacity-90">Ready for Production</p>
            </div>

            {/* List */}
            <div className="p-2">
                {/* 1. FIGMA */}
                <div
                    onClick={() => setSelected('figma')}
                    className={`group flex items-center justify-between p-4 m-2 rounded-2xl border cursor-pointer transition-all
                    ${selected === 'figma' ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500' : 'border-gray-100 bg-white hover:border-violet-200 hover:shadow-md'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${selected === 'figma' ? 'bg-violet-200 text-violet-700' : 'bg-pink-100 text-pink-600'}`}>
                            <Figma size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">Figma</h4>
                            <p className="text-xs text-gray-500">JSON • Design Tokens</p>
                        </div>
                    </div>
                    {selected === 'figma' && <div className="text-violet-600 animate-in fade-in zoom-in"><Check size={20} /></div>}
                </div>

                {/* 2. CSS */}
                <div
                    onClick={() => setSelected('css')}
                    className={`group flex items-center justify-between p-4 m-2 rounded-2xl border cursor-pointer transition-all
                    ${selected === 'css' ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500' : 'border-gray-100 bg-white hover:border-violet-200 hover:shadow-md'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${selected === 'css' ? 'bg-violet-200 text-violet-700' : 'bg-blue-100 text-blue-600'}`}>
                            <FileCode size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">CSS Variables</h4>
                            <p className="text-xs text-gray-500">:root & Dark Mode</p>
                        </div>
                    </div>
                    {selected === 'css' ? <div className="text-violet-600"><Check size={20} /></div> :
                        <button onClick={(e) => { e.stopPropagation(); handleCopy('css'); }} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg" title="Copy">
                            <Copy size={16} />
                        </button>
                    }
                </div>

                {/* 3. TAILWIND */}
                <div
                    onClick={() => setSelected('tailwind')}
                    className={`group flex items-center justify-between p-4 m-2 rounded-2xl border cursor-pointer transition-all
                    ${selected === 'tailwind' ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500' : 'border-gray-100 bg-white hover:border-violet-200 hover:shadow-md'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${selected === 'tailwind' ? 'bg-violet-200 text-violet-700' : 'bg-cyan-100 text-cyan-600'}`}>
                            <Code2 size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">Tailwind Config</h4>
                            <p className="text-xs text-gray-500">theme.extend.colors</p>
                        </div>
                    </div>
                    {selected === 'tailwind' ? <div className="text-violet-600"><Check size={20} /></div> :
                        <button onClick={(e) => { e.stopPropagation(); handleCopy('tailwind'); }} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg" title="Copy">
                            <Copy size={16} />
                        </button>
                    }
                </div>
            </div>

            {/* 4. ANDROID */}
            <div
                onClick={() => setSelected('android')}
                className={`group flex items-center justify-between p-4 m-2 rounded-2xl border cursor-pointer transition-all
                    ${selected === 'android' ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500' : 'border-gray-100 bg-white hover:border-violet-200 hover:shadow-md'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${selected === 'android' ? 'bg-violet-200 text-violet-700' : 'bg-green-100 text-green-600'}`}>
                        <span className="font-bold text-xs">XML</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">Android Views</h4>
                        <p className="text-xs text-gray-500">colors.xml (M3 Tones)</p>
                    </div>
                </div>
                {selected === 'android' && <div className="text-violet-600"><Check size={20} /></div>}
            </div>

            {/* 5. iOS */}
            <div
                onClick={() => setSelected('ios')}
                className={`group flex items-center justify-between p-4 m-2 rounded-2xl border cursor-pointer transition-all
                    ${selected === 'ios' ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500' : 'border-gray-100 bg-white hover:border-violet-200 hover:shadow-md'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${selected === 'ios' ? 'bg-violet-200 text-violet-700' : 'bg-slate-100 text-slate-800'}`}>
                        <span className="font-bold text-xs">iOS</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">Swift UI</h4>
                        <p className="text-xs text-gray-500">Dynamic Colors.swift</p>
                    </div>
                </div>
                {selected === 'ios' && <div className="text-violet-600"><Check size={20} /></div>}
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                <button
                    type="button"
                    onClick={handleExportSelected}
                    disabled={!selected}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-black hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                    <Download size={18} />
                    {selected ? `Download ${selected === 'figma' ? 'JSON' : selected === 'css' ? 'CSS' : selected === 'android' ? 'XML' : selected === 'ios' ? 'Swift' : 'Config'}` : 'Select Format'}
                </button>
            </div>

            <div className="text-center p-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                Adsense Safe • MIT License
            </div>
        </div >
    );
};
