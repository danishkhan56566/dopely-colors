'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Sparkles, Wand2, ArrowRight, Loader2, Upload,
    Palette, Check, Code, Image as ImageIcon, RotateCcw, Download, Copy, Maximize2, Minimize2
} from 'lucide-react';
import {
    Step, Message, AssistantState, Sender,
    analyzeText, generateDesignTokens, generateLogoConcepts, AIPalette,
    createInitialDesign, evolveDesignSystem, designStateToPalette, parseUserIntent
} from '@/lib/ai-assistant';
import { FeaturePreview, DesignTokensPreview } from './AIPreviews';
import { AIExportCard } from './AIExportCard';
import { toast } from 'sonner';
import { usePaletteStore } from '@/store/usePaletteStore';
import { useRouter } from 'next/navigation';
import { extractColors } from 'extract-colors';

// --- Chat Bubble Component ---
const ChatBubble = ({ message }: { message: Message }) => {
    const isUser = message.sender === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full mb-6 gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${isUser ? 'bg-gray-900 text-white' : 'bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white'}`}>
                {isUser ? 'U' : <Sparkles size={14} fill="currentColor" />}
            </div>

            <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Name */}
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {isUser ? 'You' : 'Dopely AI'}
                </span>

                <div
                    className={`
                        text-md leading-relaxed
                        ${isUser
                            ? 'bg-gray-100/50 p-4 rounded-2xl rounded-tr-none text-gray-800'
                            : 'text-gray-800' // Minimal style for AI, no bubble
                        }
                    `}
                >
                    {message.text}
                </div>

                {/* --- Dynamic Content Rendering based on Message Type --- */}

                {/* 1. Logo Options */}
                {message.type === 'logo-options' && message.data && (
                    <div className="grid grid-cols-3 gap-4 w-full mt-2">
                        {message.data.map((logo: any) => (
                            <button
                                key={logo.id}
                                className="aspect-square bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-violet-500 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-2 group"
                            >
                                <div className="w-12 h-12" dangerouslySetInnerHTML={{ __html: logo.svg }} />
                                <span className="text-xs font-bold text-gray-400 group-hover:text-violet-600 uppercase tracking-wider">{logo.vibe}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* 2. Palette Preview */}
                {message.type === 'palette' && message.data && (
                    <div className="w-full mt-2 bg-white p-2 rounded-[2rem] shadow-xl border border-gray-100">
                        <div className="h-32 flex rounded-3xl overflow-hidden mb-4 shadow-inner">
                            {message.data.colors.map((c: string, idx: number) => {
                                const roles = ['Primary', 'Secondary', 'Accent', 'Bg', 'Text'];
                                return (
                                    <div key={c} className="flex-1 h-full group relative flex flex-col justify-end" style={{ backgroundColor: c }}>
                                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                                            <span className="text-[8px] font-bold text-white uppercase tracking-widest mb-1 drop-shadow-md">{roles[idx]}</span>
                                            <span className="text-[10px] font-bold bg-white/90 px-1.5 py-0.5 rounded text-gray-900 uppercase shadow-sm">{c}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="px-4 pb-2 flex justify-between items-center">
                            <div className="flex gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                                <span>{message.data.vibe} Vibe</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                <Check size={10} strokeWidth={4} />
                                <span>Accessible</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Design System Summary Card (Legacy, kept for backup if needed, but we prefer ExportUI) */}
                {message.type === 'design-system' && message.data && (
                    <div className="mt-4 w-full bg-white rounded-3xl shadow-xl border border-violet-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 text-white text-center">
                            <div className="inline-flex p-3 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                                <Check size={24} />
                            </div>
                            <h3 className="text-xl font-black mb-1">Your Design System is Ready!</h3>
                            <p className="text-violet-100 text-sm opacity-90">Ready for Web, iOS, and Android</p>
                        </div>
                    </div>
                )}

                {/* 4. EXPORT UI CARD */}
                {message.type === 'export-ui' && message.data && (
                    <AIExportCard design={message.data} />
                )}
            </div>
        </motion.div>
    );
};

// --- Main Assistant Component ---
export default function AIAssistant() {
    // STATE
    const [state, setState] = useState<AssistantState>({
        step: 'ENTRY',
        history: [],
        design: null,
        context: {}
    });
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    // Expand State
    const [isExpanded, setIsExpanded] = useState(false);
    const [focusedView, setFocusedView] = useState('web'); // Default focused view in modal

    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toggleFavorite } = usePaletteStore();
    const router = useRouter();

    // Initial Greeting
    useEffect(() => {
        if (state.history.length === 0) {
            // No greeting initially, just the input screen. 
            // Or maybe a "Describe your idea" prompt.
        }
    }, []);

    // Scroll to bottom helper
    const scrollToBottom = () => {
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // --- LOGIC HANDLERS ---

    const handleSendMessage = async (text: string = inputValue) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
        setState(prev => ({ ...prev, history: [...prev.history, userMsg] }));
        setInputValue('');
        setIsTyping(true);
        scrollToBottom();

        // Process based on current step
        await processAIResponse(text, state.step);
    };

    const processAIResponse = async (input: string, currentStep: Step) => {
        // Simulate delay
        await new Promise(r => setTimeout(r, 1200));

        let nextStep: Step = currentStep;
        let responseMsgs: Message[] = [];
        let newContext = { ...state.context };
        let newDesign = state.design ? { ...state.design } : null;

        // 1. ENTRY -> DISCOVERY
        if (currentStep === 'ENTRY') {
            const analysis = analyzeText(input);
            newContext.appDescription = input;
            newContext.logoVibe = analysis.vibe;
            newContext.appType = analysis.type;

            responseMsgs.push({
                id: 'ai-initial', sender: 'ai',
                text: `Great! I'll help you design a complete color system for your ${analysis.type} app.`
            });
            responseMsgs.push({
                id: 'ai-ask-logo', sender: 'ai',
                text: `Before we start, do you already have a logo for your app?`,
                actions: [
                    { label: 'Yes, I have a logo', action: 'has_logo', variant: 'primary' },
                    { label: 'No, generate one', action: 'gen_logo', variant: 'outline' }
                ]
            });
            nextStep = 'LOGO_DECISION';
        }

        // 2. LOGO DECISION
        else if (currentStep === 'LOGO_DECISION') {
            if (input.toLowerCase().includes('yes')) {
                responseMsgs.push({ id: 'ai-upload', sender: 'ai', text: "Please upload your logo so I can analyze its colors." });
                nextStep = 'LOGO_UPLOAD';
            } else {
                responseMsgs.push({
                    id: 'ai-gen', sender: 'ai', text: "No problem! I can generate some logo concepts based on your app's vibe. What style do you prefer?",
                    actions: [{ label: 'Modern', action: 'style_modern' }, { label: 'Playful', action: 'style_playful' }]
                });
                nextStep = 'LOGO_GEN';
            }
        }

        // 2b. LOGO UPLOAD
        else if (currentStep === 'LOGO_UPLOAD') {
            // Logic handled via handleImageUpload for actual image.
            // If user texts here, we skip logo or ask again.
            if (input !== 'image_uploaded') {
                responseMsgs.push({ id: 'ai-skip-logo', sender: 'ai', text: "I'll generate a palette based on your description instead." });
                nextStep = 'PALETTE_GEN';
                setTimeout(() => processAIResponse('auto', 'PALETTE_GEN'), 1000);
            } else {
                nextStep = 'PALETTE_GEN';
                setTimeout(() => processAIResponse('auto', 'PALETTE_GEN'), 1000);
            }
        }

        // 3. LOGO GEN (Simulator)
        else if (currentStep === 'LOGO_GEN') {
            const concepts = generateLogoConcepts(newContext.appType || 'general', ['#000', '#fff']);
            responseMsgs.push({
                id: 'ai-logo-res', sender: 'ai',
                text: `Here are a few concepts for your ${newContext.appType} app.`,
                type: 'logo-options', data: concepts
            });
            responseMsgs.push({
                id: 'ai-logo-next', sender: 'ai',
                text: "Based on this vibe, I'll generate your color palette now."
            });
            setTimeout(() => processAIResponse('auto', 'PALETTE_GEN'), 2000);
            nextStep = 'PALETTE_GEN';
        }

        // 4. PALETTE GEN (First Run)
        else if (currentStep === 'PALETTE_GEN') {
            // INITIAL GENERATION
            // Create Design State
            newDesign = createInitialDesign(
                newContext.appType || 'general',
                newContext.logoVibe || 'modern',
                newContext.logoColors // Use correct property name from ai-assistant.ts
            );

            const paletteData = designStateToPalette(newDesign);
            newContext.palette = paletteData.colors; // Sync for UI previews if needed

            responseMsgs.push({
                id: 'ai-pal-res', sender: 'ai',
                text: newDesign.explanation,
                type: 'palette',
                data: paletteData
            });

            responseMsgs.push({
                id: 'ai-pal-ask', sender: 'ai',
                text: "How does this feel? We can refine it, or I can show you how it looks on real screens.",
                actions: [
                    { label: 'Looks perfect! Show Preview', action: 'preview', variant: 'primary' },
                    { label: 'Make it brighter', action: 'refine_bright', variant: 'outline' },
                    { label: 'Try Dark Mode', action: 'refine_dark', variant: 'outline' }
                ]
            });
            nextStep = 'REFINEMENT';
        }

        // 5. REFINEMENT
        else if (currentStep === 'REFINEMENT') {
            // Parse Intent
            const intent = parseUserIntent(input);
            console.log('User Intent:', intent);

            if (intent.type === 'FEEDBACK' && intent.value === 'negative') {
                // Handle "I don't like this"
                responseMsgs.push({
                    id: 'ai-clarify', sender: 'ai',
                    text: `Got it 👍 What would you like to change?`,
                    actions: [
                        { label: 'Colors (Brighter)', action: 'refine_bright', variant: 'outline' },
                        { label: 'Style (Modern)', action: 'style_modern', variant: 'outline' },
                        { label: 'Mode (Light/Dark)', action: 'mode_toggle', variant: 'outline' },
                        { label: 'Start Over', action: 'reset', variant: 'secondary' }
                    ]
                });
                // Stay in REFINEMENT steps
            }
            else if (intent.type === 'RESET') {
                // Reset Design
                newDesign = createInitialDesign(newContext.appType || 'general', 'modern'); // Simple reset
                const paletteData = designStateToPalette(newDesign);
                newContext.palette = paletteData.colors;
                responseMsgs.push({ id: 'ai-reset', sender: 'ai', text: "I've reset the design system. Here is a fresh start.", type: 'palette', data: paletteData });
            }
            else if (intent.type === 'PREVIEW') {
                responseMsgs.push({ id: 'ai-prev', sender: 'ai', text: "Great! Applying these colors to your app interface..." });
                nextStep = 'APP_PREVIEW';
                setTimeout(() => processAIResponse('auto', 'APP_PREVIEW'), 1000);
            }
            else if (newDesign) {
                // Apply Refinement Mutation
                newDesign = evolveDesignSystem(newDesign, intent);
                const paletteData = designStateToPalette(newDesign);
                newContext.palette = paletteData.colors;

                responseMsgs.push({
                    id: 'ai-update-' + Date.now(),
                    sender: 'ai',
                    text: newDesign.explanation,
                    type: 'palette',
                    data: paletteData
                });
            }
        }

        // 6. APP PREVIEW
        else if (currentStep === 'APP_PREVIEW') {
            responseMsgs.push({ id: 'ai-design-sys', sender: 'ai', text: "I've applied your colors to some UI components. Ready to generate the code?", actions: [{ label: 'Yes, Export Code', action: 'export', variant: 'primary' }] });
            nextStep = 'PLATFORM_SELECT';
        }

        // 7. PLATFORM / EXPORT
        else if (currentStep === 'PLATFORM_SELECT' || currentStep === 'EXPORT') {
            if (currentStep === 'PLATFORM_SELECT') {
                const paletteData = newDesign ? designStateToPalette(newDesign).colors : [];

                // Render Export Card
                responseMsgs.push({
                    id: 'ai-export-ui',
                    sender: 'ai',
                    text: "Here is your complete Design System in every format:",
                    type: 'export-ui',
                    data: newDesign // Pass the design state
                });

                responseMsgs.push({
                    id: 'ai-save', sender: 'ai', text: "Would you like to save this project to your library?",
                    actions: [{ label: 'Save Project', action: 'save_project', variant: 'primary' }]
                });
                nextStep = 'EXPORT';
            } else {
                if (input.toLowerCase().includes('save')) {
                    responseMsgs.push({ id: 'ai-saved', sender: 'ai', text: "Project saved successfully to your dashboard." });
                }
                // Reset nextStep to avoid loops if needed, or stay in EXPORT
                nextStep = 'EXPORT';
            }
        }

        // UPDATE STATE
        setIsTyping(false);
        setState(prev => ({
            ...prev,
            step: nextStep,
            context: newContext,
            design: newDesign, // Persist the design state
            history: [...prev.history, ...responseMsgs]
        }));
        scrollToBottom();
    };

    const handleActionClick = (action: string, label: string) => {
        if (action === 'save_project' && state.context.palette) {
            toggleFavorite(state.context.palette);
            toast.success("Project saved to your Library!");
            handleSendMessage("I've saved the project.");
            return;
        }
        handleSendMessage(label); // Treat action click as user message
    };

    // Trigger AI response after logo upload state update to avoid stale closure
    // REMOVED old useEffect to avoid conflicts with new history-based watcher
    /*
    useEffect(() => {
        if (state.step === 'LOGO_UPLOAD' && state.context.logoColors) {
            const timer = setTimeout(() => {
                processAIResponse('image_uploaded', 'LOGO_UPLOAD');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [state.step, state.context.logoColors]);
    */

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const result = e.target?.result as string;

                try {
                    // Actual extraction using extract-colors
                    const extractedData = await extractColors(result);
                    const extractedHexes = extractedData.map(c => c.hex);

                    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: "Uploaded Logo", type: 'image' };

                    setState(prev => ({
                        ...prev,
                        history: [...prev.history, userMsg],
                        context: {
                            ...prev.context,
                            logo: result,
                            logoVibe: 'custom',
                            logoColors: extractedHexes
                        }
                    }));

                    const analysisMsg: Message = { id: Date.now().toString() + 'ai', sender: 'ai', text: `I've analyzed your logo and found ${extractedHexes.length} distinct colors. I'll build a design system around them.` };
                    // Don't add analysisMsg here manually, let the effect handle it to avoid dupes? 
                    // Actually, keep it for feedback, but the effect will trigger the actual work.
                    setState(prev => ({ ...prev, history: [...prev.history, analysisMsg] }));

                    // Trigger handled by useEffect watching history
                } catch (err) {
                    console.error("Color extraction failed", err);
                    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: "Uploaded Logo", type: 'image' };
                    setState(prev => ({
                        ...prev,
                        history: [...prev.history, userMsg],
                        context: { ...prev.context, logo: result, logoColors: [] }
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Action Card Handlers ---
    const handleVisualsClick = () => handleSendMessage("I want to customize the look");
    const handleCodeClick = () => handleSendMessage("Show me the CSS and Design Tokens");
    const handleExportClick = () => handleActionClick("save_project", "Save Project");
    const handleAssetsClick = () => {
        toast.info("Preparing assets package...");
        setTimeout(() => {
            toast.success("Assets downloaded! (Simulation)");
        }, 1500);
    };

    // --- Trigger AI response if context changes (e.g., re-upload logo) ---
    useEffect(() => {
        // If we have a palette AND just uploaded a NEW logo (detected by context change), regenerate.
        // We can detect this by checking if we are in a 'steady state' like REFINEMENT or EXPORT but got new logo colors.
        if ((state.step === 'REFINEMENT' || state.step === 'EXPORT') && state.context.logoColors && state.context.logoColors.length > 0) {
            // Optional: debounce or check if we already handled this specific upload? 
            // For now, let's just trigger a re-generation message to be safe.
            // But to avoid loops, we might need a flag. 
            // Simpler: Just rely on the user seeing the "Uploaded Logo" message and the AI automatically responding to THAT history event if we wire it up.
            // Actually, processAIResponse handles the logic. We just need to ensure `handleImageUpload` calls it.
            // `handleImageUpload` ADDS a history item. 
            // We need a useEffect to watch history for "Uploaded Logo" and trigger AI if it was the last message.
        }
    }, [state.context.logoColors]);

    // Better Logic: Watch History. 
    useEffect(() => {
        const lastMsg = state.history[state.history.length - 1];
        if (!lastMsg) return;

        // Case 1: Direct User Upload (if async state happened to catch it)
        if (lastMsg.sender === 'user' && lastMsg.type === 'image') {
            // processAIResponse("I've uploaded a new logo...", state.step);
            // handleImageUpload actually adds the AI response immediately after, so this might be skipped.
        }

        // Case 2: AI has just confirmed analysis. THIS IS THE KEY FIX.
        // The chat is stuck because we are sitting at 'LOGO_UPLOAD' step with an AI message 'I've analyzed...' but no trigger to move on.
        if (state.step === 'LOGO_UPLOAD' && lastMsg.sender === 'ai' && lastMsg.text.includes("analyzed your logo")) {
            // Automatically proceed to Palette Generation
            const timer = setTimeout(() => {
                processAIResponse('image_uploaded', 'LOGO_UPLOAD');
            }, 800); // Small delay for reading time
            return () => clearTimeout(timer);
        }

        // Case 3: Re-upload (Context change detected elsewhere, or check user message in Refinement)
        if (state.step === 'REFINEMENT' && lastMsg.sender === 'user' && lastMsg.type === 'image') {
            processAIResponse("I've uploaded a new logo. Please update the design.", state.step);
        }

    }, [state.history.length, state.step]);

    // 1. ENTRY VIEW (Hero)
    if (state.step === 'ENTRY' && state.history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-full ring-1 ring-black/5">
                    <Sparkles size={14} className="text-violet-600" />
                    <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
                        AI Design Partner
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-none">
                    What are you building today?
                </h1>

                <p className="text-lg text-gray-500 max-w-lg mx-auto">
                    I'm your AI design partner. I can help you create a logo, colors, and a complete design system in minutes.
                </p>

                <div className="w-full max-w-xl relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
                    <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-2">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                            placeholder="e.g. A food delivery app for vegans..."
                            className="flex-1 bg-transparent border-none outline-none p-4 text-lg text-gray-900 placeholder-gray-300 resize-none h-[64px] rounded-xl"
                            autoFocus
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            className="bg-gray-900 text-white p-4 rounded-xl hover:bg-black transition-colors"
                        >
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-2 justify-center flex-wrap">
                    {['Food App', 'Finance Dashboard', 'Portfolio', 'SaaS Platform'].map(tag => (
                        <button key={tag} onClick={() => handleSendMessage(`I want to build a ${tag}`)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors">
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // 3. NOTEBOOK LAYOUT (Refined 10x Design)
    return (
        <div className="h-[calc(100vh-100px)] w-full max-w-[1800px] mx-auto p-4 flex flex-col lg:flex-row gap-4">

            {/* --- COLUMN 1: PROJECT CONTEXT ("Sources") --- */}
            <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col gap-4">
                <div className="flex-1 bg-white rounded-[2rem] border border-gray-200 p-6 flex flex-col shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-lg text-gray-900">Project Assets</h2>
                        <span className="bg-gray-100 text-gray-400 p-1.5 rounded-lg"><Palette size={16} /></span>
                    </div>

                    {/* Sources List */}
                    <div className="space-y-3 flex-1 overflow-y-auto">

                        {/* 1. Uploaded Logo Source */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="group p-4 rounded-2xl border border-dashed border-gray-300 hover:border-violet-400 hover:bg-violet-50 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-transform">
                                <Upload size={18} className="text-gray-400 group-hover:text-violet-600" />
                            </div>
                            <div className="text-xs font-medium text-gray-500">
                                {state.context.logoColors ? 'Change Logo' : 'Add Source (Logo)'}
                            </div>
                        </div>

                        {/* 2. Detected Colors Source */}
                        {state.context.logoColors && (
                            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-white rounded-lg shadow-sm text-blue-600"><ImageIcon size={14} /></div>
                                    <span className="text-sm font-bold text-gray-700">Logo Analysis</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {state.context.logoColors.map(c => (
                                        <div key={c} className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: c }} title={c} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. Vibe Tags */}
                        {state.context.appType && (
                            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-white rounded-lg shadow-sm text-purple-600"><Sparkles size={14} /></div>
                                    <span className="text-sm font-bold text-gray-700">Context</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 capitalize shadow-sm">
                                        {state.context.appType} App
                                    </span>
                                    {state.context.logoVibe && (
                                        <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 capitalize shadow-sm">
                                            {state.context.logoVibe} Vibe
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Saved Design</h4>
                            {/* Mini Palette Preview */}
                            {state.context.palette ? (
                                <div className="h-16 flex rounded-xl overflow-hidden ring-1 ring-gray-200">
                                    {state.context.palette.map(c => (
                                        <div key={c} className="flex-1 h-full" style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                            ) : (
                                <div className="h-16 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400 border border-transparent">
                                    No design generated yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            {/* --- COLUMN 2: CHAT ("Chat") --- */}
            <div className="flex-1 min-w-0 bg-white rounded-[2rem] border border-gray-200 shadow-sm flex flex-col relative overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-900">
                            <span className="text-xl">🎨</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 leading-tight">Dopely Design Chat</h3>
                            <p className="text-xs text-gray-400">10 sources available · Powered by Gemini</p>
                        </div>
                    </div>
                    <button onClick={() => setState({ step: 'ENTRY', history: [], design: null, context: {} })} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                        <RotateCcw size={18} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth" ref={scrollRef}>
                    <AnimatePresence mode="popLayout">
                        {state.history.map((msg) => (
                            <motion.div key={msg.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <ChatBubble message={msg} />
                                {msg.actions && (
                                    <div className="flex flex-wrap gap-2 ml-0 pl-12 -mt-4 mb-4">
                                        {msg.actions.map(action => (
                                            <button
                                                key={action.action}
                                                onClick={() => handleActionClick(action.action, action.label)}
                                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border
                                                    ${action.variant === 'primary'
                                                        ? 'bg-gray-900 text-white border-gray-900 hover:bg-black'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                                                    }`}
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <div className="pl-12">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="inline-flex gap-1.5 p-3 bg-white rounded-2xl rounded-tl-none border border-gray-100 shadow-sm"
                            >
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                            </motion.div>
                        </div>
                    )}
                    <div className="h-24" /> {/* Spacer for floating input */}
                </div>

                {/* Floating Input Bar (Notebook Style) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[85%] z-20">
                    <div className="relative flex items-center gap-2 p-2 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 focus-within:ring-2 focus-within:ring-gray-900/10 transition-all">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                            <Upload size={18} />
                        </button>

                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Describe your design needs..."
                            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm font-medium h-10"
                            disabled={isTyping}
                        />

                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isTyping}
                            className={`p-3 rounded-full transition-all flex items-center justify-center
                                ${!inputValue.trim() || isTyping
                                    ? 'bg-gray-100 text-gray-300'
                                    : 'bg-gray-900 text-white hover:bg-black hover:scale-105'
                                }
                            `}
                        >
                            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                        </button>
                    </div>
                </div>

            </div>

            {/* --- COLUMN 3: STUDIO ("Studio") --- */}
            <div className={`w-full lg:w-[420px] 2xl:w-[500px] flex-shrink-0 flex flex-col gap-4 transition-all duration-500 rounded-[2rem] overflow-hidden ${!state.context.palette ? 'bg-gray-50/50' : ''}`}>

                {/* 1. Quick Tool Cards */}
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleVisualsClick} className="bg-[#E0F2FE] hover:bg-[#d0ebfd] p-4 rounded-3xl flex items-center gap-3 transition-colors text-left group">
                        <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <Palette size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-gray-800">Visuals</h4>
                            <p className="text-[10px] text-gray-500 font-medium">Customize Look</p>
                        </div>
                    </button>
                    <button onClick={handleCodeClick} className="bg-[#FAE8FF] hover:bg-[#f5d0fe] p-4 rounded-3xl flex items-center gap-3 transition-colors text-left group">
                        <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-fuchsia-600 group-hover:scale-110 transition-transform">
                            <Code size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-gray-800">Code</h4>
                            <p className="text-[10px] text-gray-500 font-medium">Export CSS/Tokens</p>
                        </div>
                    </button>
                    <button onClick={handleExportClick} className="bg-[#DCFCE7] hover:bg-[#bbf7d0] p-4 rounded-3xl flex items-center gap-3 transition-colors text-left group">
                        <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                            <Download size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-gray-800">Export</h4>
                            <p className="text-[10px] text-gray-500 font-medium">Save Project</p>
                        </div>
                    </button>
                    <button onClick={handleAssetsClick} className="bg-[#FEF3C7] hover:bg-[#fde68a] p-4 rounded-3xl flex items-center gap-3 transition-colors text-left group">
                        <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                            <ImageIcon size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-gray-800">Assets</h4>
                            <p className="text-[10px] text-gray-500 font-medium">Download UI</p>
                        </div>
                    </button>
                </div>

                {/* 2. Main Studio Canvas (Live Preview) */}
                <div className="flex-1 bg-white rounded-[2rem] border border-gray-200 flex flex-col shadow-sm overflow-hidden relative">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur z-10 sticky top-0">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <h3 className="font-bold text-sm text-gray-900">Live Studio</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1 text-[10px] font-bold text-gray-400 uppercase">
                                <span>{state.context.appType || 'App'} Preview</span>
                            </div>
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
                                title="Expand Preview"
                            >
                                <Maximize2 size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50 relative p-4 lg:p-6 flex items-center justify-center">
                        {state.context.palette ? (
                            <div className="scale-[0.8] lg:scale-[0.85] origin-top h-full w-full">
                                <FeaturePreview colors={state.context.palette} type={state.context.appType || 'general'} design={state.design} />
                            </div>
                        ) : (
                            <div className="text-center p-8 opacity-50">
                                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
                                <p className="text-sm font-medium text-gray-400">Waiting for design data...</p>
                            </div>
                        )}
                    </div>

                    {/* Floating Info Pill */}
                    {state.context.palette && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/90 backdrop-blur shadow-lg rounded-full border border-gray-100 flex items-center gap-2">
                            <div className="flex -space-x-1">
                                {state.context.palette.map(c => (
                                    <div key={c} className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: c }} />
                                ))}
                            </div>
                            <span className="text-[10px] font-bold text-gray-600">Active Palette</span>
                        </div>
                    )}
                </div>

            </div>

            {/* --- FULL SCREEN PREVIEW MODAL --- */}
            <AnimatePresence>
                {isExpanded && state.context.palette && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white/80 backdrop-blur-xl flex items-center justify-center p-8"
                    >
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="absolute top-6 right-6 p-4 rounded-full bg-white shadow-xl hover:bg-gray-100 transition-colors z-50 group border border-gray-100"
                        >
                            <Minimize2 size={24} className="text-gray-900 group-hover:scale-90 transition-transform" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-6xl h-full bg-gray-50 rounded-[3rem] shadow-2xl border border-gray-200 overflow-hidden relative flex flex-col md:flex-row"
                        >
                            <div className="flex-1 overflow-y-auto p-12 flex items-center justify-center bg-gray-200/50 relative">
                                {/* Grid Pattern Background */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                                <div className="scale-110 md:scale-125 transform-gpu transition-all p-8">
                                    <FeaturePreview
                                        colors={state.context.palette}
                                        type={state.context.appType || 'general'}
                                        design={state.design}
                                        activeTab={focusedView} // Controlled
                                        onTabChange={setFocusedView}
                                    />
                                </div>
                            </div>

                            <div className="w-80 bg-white border-l border-gray-200 p-8 flex flex-col justify-center gap-8 shadow-xl z-20">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">Focused Preview</h3>
                                    <p className="text-gray-500">Analyze your design in detail without distractions.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-xs font-bold uppercase text-gray-400 tracking-widest">Platform</div>
                                    <div className="flex flex-col gap-2">
                                        {['android', 'ios', 'web'].map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setFocusedView(p)}
                                                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between px-4 ${focusedView === p ? 'bg-gray-900 text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-500 hover:bg-white hover:shadow-sm'
                                                    }`}
                                            >
                                                <span className="capitalize">{p === 'web' ? 'Web Dashboard' : p === 'ios' ? 'iOS App' : 'Android App'}</span>
                                                {focusedView === p && <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-xs font-bold uppercase text-gray-400 tracking-widest">Active Colors</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {state.context.palette.slice(0, 6).map((c, i) => (
                                            <div key={i} className="h-12 rounded-xl flex items-center justify-center text-[10px] font-bold text-white/90 shadow-sm transition-transform hover:scale-105" style={{ backgroundColor: c }}>
                                                {c}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <button onClick={() => setIsExpanded(false)} className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black transition-all shadow-lg hover:shadow-gray-900/20">
                                        Close Preview
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
