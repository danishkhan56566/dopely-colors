'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Sparkles, Wand2, ArrowRight, Loader2, Upload,
    Palette, Check, Code, Image as ImageIcon, RotateCcw, Download, Copy, Maximize2, Minimize2,
    Activity, Layout, Save
} from 'lucide-react';
import {
    Step, Message, AssistantState, Sender,
    analyzeText, generateDesignTokens, generateLogoConcepts, AIPalette,
    createInitialDesign, evolveDesignSystem, designStateToPalette, parseUserIntent
} from '@/lib/ai-assistant';
// import { FeaturePreview, DesignTokensPreview } from './AIPreviews';
// import { AIExportCard } from './AIExportCard';
import { toast } from 'sonner';
import { usePaletteStore } from '@/store/usePaletteStore';
import { useRouter } from 'next/navigation';
// import { extractColors } from 'extract-colors'; // Moved to dynamic import
import dynamic from 'next/dynamic';

const FeaturePreview = dynamic(() => import('./AIPreviews').then(mod => mod.FeaturePreview), {
    loading: () => <div className="w-full h-full bg-gray-100/50 animate-pulse rounded-3xl" />
});
const DesignTokensPreview = dynamic(() => import('./AIPreviews').then(mod => mod.DesignTokensPreview), {
    loading: () => <div className="w-full h-40 bg-gray-100/50 animate-pulse rounded-3xl" />
});
const AIExportCard = dynamic(() => import('./AIExportCard').then(mod => mod.AIExportCard), {
    loading: () => <div className="w-full h-64 bg-gray-100/50 animate-pulse rounded-3xl" />
});

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

    // Initial Greeting & User ID Setup
    useEffect(() => {
        // 1. Setup Identity for Cloud Sync
        if (!localStorage.getItem('dopely_user_id')) {
            const newId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('dopely_user_id', newId);
            console.log('New User ID generated:', newId);
        }

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
                id: 'ai-initial-' + Date.now(), sender: 'ai',
                text: `Great! I'll help you design a complete color system for your ${analysis.type} app.`
            });
            responseMsgs.push({
                id: 'ai-ask-logo-' + Date.now(), sender: 'ai',
                text: `Before we start, do you already have a logo for your app?`,
                actions: [
                    { label: 'Yes, I have a logo', action: 'has_logo', variant: 'primary' },
                    { label: 'Continue', action: 'gen_logo', variant: 'outline' }
                ]
            });
            nextStep = 'LOGO_DECISION';
        }

        // 2. LOGO DECISION
        else if (currentStep === 'LOGO_DECISION') {
            if (input.toLowerCase().includes('yes')) {
                responseMsgs.push({ id: 'ai-upload-' + Date.now(), sender: 'ai', text: "Please upload your logo so I can analyze its colors." });
                nextStep = 'LOGO_UPLOAD';
            } else {
                responseMsgs.push({
                    id: 'ai-skip-gen-' + Date.now(), sender: 'ai', text: "Understood. I'll proceed directly to creating your color palette ecosystem."
                });
                nextStep = 'PALETTE_GEN';
                setTimeout(() => processAIResponse('auto', 'PALETTE_GEN'), 1000);
            }
        }

        // 2b. LOGO UPLOAD
        else if (currentStep === 'LOGO_UPLOAD') {
            // Logic handled via handleImageUpload for actual image.
            // If user texts here, we skip logo or ask again.
            if (input !== 'image_uploaded') {
                responseMsgs.push({ id: 'ai-skip-logo-' + Date.now(), sender: 'ai', text: "I'll generate a palette based on your description instead." });
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
                id: 'ai-logo-res-' + Date.now(), sender: 'ai',
                text: `Here are a few concepts for your ${newContext.appType} app.`,
                type: 'logo-options', data: concepts
            });
            responseMsgs.push({
                id: 'ai-logo-next-' + Date.now(), sender: 'ai',
                text: "Based on this vibe, I'll generate your color palette now."
            });
            setTimeout(() => processAIResponse('auto', 'PALETTE_GEN'), 2000);
            nextStep = 'PALETTE_GEN';
        }

        // 4. PALETTE GEN (First Run)
        else if (currentStep === 'PALETTE_GEN') {
            // INITIAL GENERATION
            let seedFromBackend = null;
            let backendSystem = null;

            // If NO logo colors, try to use Neural Backend for Text-to-Palette
            if (!newContext.logoColors || newContext.logoColors.length === 0) {
                // Show a temporary loading indicator
                const loadingMsgId = 'ai-loading-neural-' + Date.now();
                setState(prev => ({
                    ...prev,
                    history: [...prev.history, {
                        id: loadingMsgId,
                        sender: 'ai',
                        // Visual cue for the user - 10x UX
                        text: "Connecting to Neural Core..."
                    }]
                }));

                try {
                    const response = await fetch('/api/generate/text-to-palette', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: newContext.appDescription || 'Modern app', count: 5 })
                    });

                    // Remove loading message
                    setState(prev => ({
                        ...prev,
                        history: prev.history.filter(m => m.id !== loadingMsgId)
                    }));

                    if (response.ok) {
                        const data = await response.json();
                        if (data.status === 'success' || data.status === 'mock') {
                            seedFromBackend = data.seed;

                            if (data.ai_suggestions) {
                                newContext.logoColors = [
                                    data.ai_suggestions.primary,
                                    data.ai_suggestions.secondary,
                                    data.ai_suggestions.tertiary
                                ].filter(Boolean);
                            } else {
                                newContext.logoColors = [data.seed];
                            }

                            toast.success(data.status === 'mock' ? "Generated (Dev Mock)" : "Generated via OpenAI");
                        }
                    }
                } catch (err) {
                    console.warn("Text-to-Palette backend failed, falling back to local logic", err);
                    // Remove loading message on error too
                    setState(prev => ({
                        ...prev,
                        history: prev.history.filter(m => m.id !== loadingMsgId)
                    }));
                }
            }

            // Create Design State (Client Logic, potentially seeded by Backend Data)
            newDesign = createInitialDesign(
                newContext.appType || 'general',
                newContext.logoVibe || 'modern',
                newContext.logoColors // Now potentially populated by Backend AI
            );

            const paletteData = designStateToPalette(newDesign);
            newContext.palette = paletteData.colors; // Sync for UI previews if needed

            responseMsgs.push({
                id: 'ai-pal-res-' + Date.now(), sender: 'ai',
                text: newDesign.explanation,
                type: 'palette',
                data: paletteData
            });

            responseMsgs.push({
                id: 'ai-pal-ask-' + Date.now(), sender: 'ai',
                text: "How does this feel? We can refine it, or I can show you how it looks on real screens.",
                actions: [
                    { label: 'Looks perfect! Show Preview', action: 'preview', variant: 'primary' },
                    { label: 'Make it brighter', action: 'refine_bright', variant: 'outline' },
                    { label: 'Try Dark Mode', action: 'refine_dark', variant: 'outline' },
                    { label: 'Regenerate', action: 'regenerate', variant: 'secondary' }
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
                    id: 'ai-clarify-' + Date.now(), sender: 'ai',
                    text: `Got it 👍 What would you like to change?`,
                    actions: [
                        { label: 'Colors (Brighter)', action: 'refine_bright', variant: 'outline' },
                        { label: 'Style (Modern)', action: 'style_modern', variant: 'outline' },
                        { label: 'Mode (Light/Dark)', action: 'mode_toggle', variant: 'outline' },
                        { label: 'Start Over', action: 'reset', variant: 'secondary' }
                    ]
                });
            }

            // --- AGENTIC BACKEND INTEGRATION ---
            // Instead of local regex, we send the intent to the Agentic Backend
            try {
                // Get User ID from LocalStorage logic (which we initialized in useEffect)
                const storedUserId = localStorage.getItem('dopely_user_id') || 'guest';

                // Use relative path '/api/chat' which works in Prod (Vercel) and Dev (Next.js Rewrite)
                const chatResponse = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: input,
                        current_state: newContext,
                        current_design: newDesign, // Pass full design state for stateless processing
                        user_id: storedUserId
                    })
                });

                if (chatResponse.ok) {
                    const data = await chatResponse.json();

                    // BUCKET A: Design Action
                    if (data.type === 'action') {
                        // Backend generated new system (DesignSystemOutput)
                        const backendSystem = data.data;

                        if (backendSystem && backendSystem.base_colors) {
                            // Construct DesignState directly from Backend System
                            const prevHistory = state.design ? [...state.design.history, state.design] : [];

                            newDesign = {
                                brand_colors: {
                                    primary: backendSystem.base_colors.primary,
                                    secondary: backendSystem.base_colors.secondary,
                                    accent: backendSystem.base_colors.tertiary,
                                    background: backendSystem.platforms.android_material.surface,
                                    text: backendSystem.platforms.android_material.neutral_10 || '#111827'
                                },
                                system: backendSystem,
                                mode: 'light', // Default to light unless we parse 'mode' from intent or data
                                vibe: newContext.logoVibe || 'modern',
                                brightness_level: 1,
                                saturation_level: 1,
                                history: prevHistory as any, // Type cast to avoid complexity with recursion
                                version_id: 'v_ai_' + Date.now(),
                                explanation: data.message || "I've updated the design system."
                            };

                            const paletteData = designStateToPalette(newDesign);
                            newContext.palette = paletteData.colors;

                            responseMsgs.push({
                                id: 'ai-agent-action-' + Date.now(),
                                sender: 'ai',
                                text: newDesign.explanation,
                                type: 'palette',
                                data: paletteData
                            });
                        }
                    }
                    // BUCKET B & C: Domain Knowledge / Out of Scope (Handled by Backend)
                    else {
                        responseMsgs.push({
                            id: 'ai-agent-chat-' + Date.now(),
                            sender: 'ai',
                            text: data.message,
                            type: data.type, // Pass through UI type (e.g. export-ui)
                            data: data.data  // Pass through UI data (e.g. design state)
                        });
                    }
                } else {
                    // Fallback if backend offline
                    responseMsgs.push({
                        id: 'ai-err-' + Date.now(), sender: 'ai', text: "I'm having trouble connecting to my brain. Please try again."
                    });
                }
            } catch (err) {
                console.error("Agent Backend Error", err);
                responseMsgs.push({
                    id: 'ai-err-local-' + Date.now(), sender: 'ai', text: "Network error. Using local fallback..."
                });
                // Optional: Fallback to old regex logic here if critical
            }
        }

        // 6. APP PREVIEW
        else if (currentStep === 'APP_PREVIEW') {
            responseMsgs.push({ id: 'ai-design-sys-' + Date.now(), sender: 'ai', text: "I've applied your colors to some UI components. Ready to generate the code?", actions: [{ label: 'Yes, Export Code', action: 'export', variant: 'primary' }] });
            nextStep = 'PLATFORM_SELECT';
        }

        // 7. PLATFORM / EXPORT
        else if (currentStep === 'PLATFORM_SELECT' || currentStep === 'EXPORT') {
            if (currentStep === 'PLATFORM_SELECT') {
                const paletteData = newDesign ? designStateToPalette(newDesign).colors : [];

                // Render Export Card
                responseMsgs.push({
                    id: 'ai-export-ui-' + Date.now(),
                    sender: 'ai',
                    text: "Here is your complete Design System in every format:",
                    type: 'export-ui',
                    data: newDesign // Pass the design state
                });

                responseMsgs.push({
                    id: 'ai-save-' + Date.now(), sender: 'ai', text: "Would you like to save this project to your library?",
                    actions: [{ label: 'Save Project', action: 'save_project', variant: 'primary' }]
                });
                nextStep = 'EXPORT';
            } else {
                if (input.toLowerCase().includes('save')) {
                    responseMsgs.push({ id: 'ai-saved-' + Date.now(), sender: 'ai', text: "Project saved successfully to your dashboard." });
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

            // 1. Preview Logic (Standard)
            reader.onload = async (e) => {
                const result = e.target?.result as string;

                try {
                    // 2. Try Python Backend First (Superior Logic)
                    const formData = new FormData();
                    formData.append('file', file);

                    let extractedHexes: string[] = [];
                    let seedColor = '';

                    try {
                        const response = await fetch('/api/generate/image-to-palette', {
                            method: 'POST',
                            body: formData,
                        });

                        if (response.ok) {
                            const data = await response.json();
                            if (data.status === 'success') {
                                seedColor = data.seed;
                                // Use the generated system primary tones as the "extracted colors" for context
                                // This matches the user's intent better than random extraction
                                const p = data.system.palettes.primary;
                                extractedHexes = [
                                    seedColor,
                                    p['40'], // Primary
                                    p['90'], // Container
                                    data.system.palettes.secondary['40'],
                                    data.system.palettes.tertiary['40']
                                ];
                                toast.success("AI Analysis Complete (via Python Engine)");
                            }
                        }
                    } catch (backendErr) {
                        console.warn("Backend unavailable, falling back to client-side extraction", backendErr);
                    }

                    // 3. Fallback to Client Side if Backend Failed
                    if (extractedHexes.length === 0) {
                        const { extractColors } = await import('extract-colors');
                        const extractedData = await extractColors(result);
                        extractedHexes = extractedData.map((c: any) => c.hex);
                        toast.info("Analysis Complete (Client-side fallback)");
                    }

                    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: "Uploaded Logo", type: 'image' };

                    setState(prev => ({
                        ...prev,
                        history: [...prev.history, userMsg],
                        context: {
                            ...prev.context,
                            logo: result,
                            logoVibe: 'custom',
                            logoColors: extractedHexes,
                            // If we have a backend seed, we could enforce it specifically, 
                            // but logoColors[0] is usually treated as the seed in createInitialDesign
                        }
                    }));

                    const analysisMsg: Message = { id: Date.now().toString() + 'ai', sender: 'ai', text: `I've analyzed your logo using my neural engine and found the perfect brand colors.` };

                    setState(prev => ({ ...prev, history: [...prev.history, analysisMsg] }));

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
    // --- Action Card Handlers ---
    const handleVisualsClick = () => handleSendMessage("Help me refine the visuals");
    const handleCodeClick = () => handleSendMessage("Show me the CSS and Design Tokens");
    const handleExportClick = () => handleActionClick("save_project", "Save Project");
    const handleAssetsClick = () => handleSendMessage("Generate assets and export package");

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

    // 1. ENTRY VIEW (Hero Redesign)
    if (state.step === 'ENTRY' && state.history.length === 0) {
        return (
            <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center px-4 overflow-hidden">

                {/* --- Data-Rich Background Elements --- */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                </div>

                <div className="relative z-10 max-w-6xl w-full flex flex-col items-center space-y-12 py-20 text-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.03)] rounded-full ring-1 ring-black/5"
                    >
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                            Neural Design Partner v2.0
                        </span>
                    </motion.div>

                    {/* Hero Text */}
                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight leading-[0.9] max-w-4xl"
                        >
                            Imagine your <span className="text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-600">Design System</span> in seconds.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-500 max-w-2xl mx-auto font-medium"
                        >
                            Turn a simple idea, a brand logo, or a single color into a production-ready design ecosystem for every platform.
                        </motion.p>
                    </div>

                    {/* Command Center Input */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full max-w-2xl relative group"
                    >
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-indigo-500/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 blur transition duration-700" />
                        <div className="relative bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-2 border border-gray-100/50" suppressHydrationWarning>
                            <div className="flex items-center">
                                <div className="pl-6 text-gray-400 group-focus-within:text-violet-500 transition-colors">
                                    <Sparkles size={24} />
                                </div>
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                    placeholder="e.g. A modern fintech app for Gen Z with neon vibes..."
                                    className="flex-1 bg-transparent border-none outline-none p-6 text-lg text-gray-900 placeholder-gray-300 resize-none h-[76px] font-medium"
                                    autoFocus
                                />
                                <button
                                    onClick={() => handleSendMessage()}
                                    className="bg-gray-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-black transition-all shadow-lg hover:shadow-black/20 mr-1 group/btn"
                                >
                                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Prompts */}
                        <div className="mt-6 flex flex-wrap gap-2 justify-center px-4">
                            {['Finance Dashboard', 'Food Delivery', 'Portfolio', 'SaaS Landing Page'].map(tag => (
                                <button key={tag} onClick={() => handleSendMessage(`I want to build a ${tag}`)} className="px-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-[11px] font-bold text-gray-500 hover:text-gray-900 hover:border-gray-900 shadow-sm transition-all hover:-translate-y-0.5">
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* --- AI Capabilities Bento Grid (THE DATA PART) --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl pt-20">
                        {/* Card 1: Logo Intel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm text-left flex flex-col gap-6 group hover:shadow-xl transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:rotate-12 transition-transform">
                                <Upload size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">Logo Analysis</h3>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed">Drop your logo and let AI extract brand vibes, accessibility scores, and semantic color roles.</p>
                            </div>
                            <div className="mt-auto pt-4 flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-6 h-6 rounded-md ${i == 1 ? 'bg-orange-500' : i == 2 ? 'bg-orange-300' : 'bg-gray-100'}`} />)}
                            </div>
                        </motion.div>

                        {/* Card 2: Neural Generation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-8 rounded-[2.5rem] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 animate-gradient text-white shadow-2xl text-left flex flex-col gap-6 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                                <Sparkles size={120} />
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xl">
                                <Palette size={24} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-2">Neural Palettes</h3>
                                <p className="text-sm text-gray-300 font-medium leading-relaxed">Proprietary algorithms generate color systems that are automatically checked for WCAG 3.0 accessibility.</p>
                            </div>
                            <div className="mt-auto relative z-10 py-1 px-3 bg-white/10 backdrop-blur-md rounded-lg inline-flex items-center gap-2 self-start border border-white/10">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                <span className="text-[10px] font-bold tracking-widest uppercase">98.5% Smart Score</span>
                            </div>
                        </motion.div>

                        {/* Card 3: Multi-Platform */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm text-left flex flex-col gap-6 group hover:shadow-xl transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                <Code size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">Platform Ready</h3>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed">Instant CSS Variables, Tailwind Configs, and Material Tokens. Ready for Web, iOS, and Android production.</p>
                            </div>
                            <div className="mt-auto flex -space-x-3">
                                {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-indigo-400 font-black text-[10px]">{i == 1 ? 'JS' : i == 2 ? 'CSS' : 'SW'}</div>)}
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="pt-20 flex gap-12 items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
                    >
                        <div className="text-center">
                            <div className="text-2xl font-black text-gray-900">1.2M+</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tokens Generated</div>
                        </div>
                        <div className="w-px h-8 bg-gray-200" />
                        <div className="text-center">
                            <div className="text-2xl font-black text-gray-900">99.9%</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Accessibility Rating</div>
                        </div>
                        <div className="w-px h-8 bg-gray-200" />
                        <div className="text-center">
                            <div className="text-2xl font-black text-gray-900">50k+</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Project Assets</div>
                        </div>
                    </motion.div>

                </div>
            </div>
        );
    }

    // 3. NOTEBOOK LAYOUT (Refined 10x Design)
    return (
        <div className="h-[calc(100vh-100px)] w-full max-w-[1800px] mx-auto p-4 flex flex-col lg:flex-row gap-4">

            {/* --- COLUMN 1: PROJECT CONTEXT ("Neural Hub") --- */}
            <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-4">
                <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 p-6 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.02)] relative overflow-hidden group">

                    {/* Neural Pulse Header */}
                    <div className="mb-8 p-4 rounded-3xl bg-violet-600 text-white relative overflow-hidden shadow-lg shadow-violet-200">
                        <div className="absolute top-0 right-0 p-4 opacity-20"><Activity size={48} /></div>
                        <div className="relative z-10 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Neural Status</span>
                            </div>
                            <h3 className="text-lg font-black tracking-tight">System Optimized</h3>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <div className="px-2 py-1 bg-white/10 rounded-lg">
                                    <div className="text-[8px] font-bold uppercase opacity-60">Contrast</div>
                                    <div className="text-xs font-black">AAA 9.4:1</div>
                                </div>
                                <div className="px-2 py-1 bg-white/10 rounded-lg">
                                    <div className="text-[8px] font-bold uppercase opacity-60">Tokens</div>
                                    <div className="text-xs font-black">124 Ready</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6 px-2">
                        <h2 className="font-black text-xs uppercase tracking-widest text-gray-400">Design Genome</h2>
                        <span className="text-gray-400"><Layout size={14} /></span>
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
                                        <span className="px-3 py-1 bg-white border border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 capitalize shadow-sm flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            {state.context.logoVibe} Mode
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Saved Design</h4>
                            {/* Mini Palette Preview */}
                            {state.context.palette ? (
                                <div className="h-16 flex rounded-[1.2rem] overflow-hidden ring-1 ring-gray-100 shadow-sm">
                                    {state.context.palette.map(c => (
                                        <div key={c} className="flex-1 h-full" style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                            ) : (
                                <div className="h-16 rounded-[1.2rem] bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-dashed border-gray-200 uppercase tracking-widest">
                                    Awaiting Neural Data
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Intelligent Insights Footer */}
                <div className="p-5 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        <span>A11y Predictor</span>
                        <span className="text-green-500">99.8%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-[99%] bg-gradient-to-r from-violet-500 to-fuchsia-400 rounded-full" />
                    </div>
                    <p className="text-[9px] text-gray-400 font-bold leading-relaxed uppercase tracking-wider opacity-60">Architectural sensory harmony verified.</p>
                </div>
            </div>

            {/* --- COLUMN 2: CHAT ("Neural Stream") --- */}
            <div className="flex-1 min-w-0 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm flex items-center justify-center text-indigo-600">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 leading-tight">Neural Design Chat</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Stream · Gemini 1.5 Pro</p>
                        </div>
                    </div>
                    <button onClick={() => setState({ step: 'ENTRY', history: [], design: null, context: {} })} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                        <RotateCcw size={18} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth no-scrollbar" ref={scrollRef}>
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
                                                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border
                                                    ${action.variant === 'primary'
                                                        ? 'bg-gray-900 text-white border-gray-900 hover:bg-black shadow-lg shadow-gray-200'
                                                        : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 shadow-sm'
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
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                            </motion.div>
                        </div>
                    )}
                    <div className="h-24" />
                </div>

                {/* Floating Input Bar */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[85%] z-20" suppressHydrationWarning>
                    <div className="relative flex items-center gap-2 p-2 rounded-[2rem] bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        <button onClick={() => fileInputRef.current?.click()} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                            <Upload size={18} />
                        </button>
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Fine-tune your design system..."
                            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm font-semibold h-11 px-2"
                            disabled={isTyping}
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isTyping}
                            className={`w-11 h-11 rounded-full transition-all flex items-center justify-center
                                ${!inputValue.trim() || isTyping ? 'bg-gray-50 text-gray-200' : 'bg-gray-900 text-white hover:bg-black shadow-lg'}
                            `}
                        >
                            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                        </button>
                    </div>
                </div>

            </div>

            {/* --- COLUMN 3: STUDIO ("Studio") --- */}
            <div className={`w-full lg:w-[420px] 2xl:w-[500px] flex-shrink-0 flex flex-col gap-4 transition-all duration-500 rounded-[2rem] overflow-hidden ${!state.context.palette ? 'bg-gray-50/50' : ''}`}>

                {/* Intelligent Action Cards */}
                <div className="grid grid-cols-2 gap-3 shrink-0">
                    <button onClick={handleVisualsClick} className="bg-indigo-50 hover:bg-indigo-100 p-5 rounded-[2.2rem] flex items-center gap-3 transition-all text-left group border border-indigo-100/50 hover:scale-[1.02] active:scale-95">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 group-hover:rotate-12 transition-transform shadow-sm">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h4 className="font-black text-sm text-gray-900">Visuals</h4>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Customize Look</p>
                        </div>
                    </button>
                    <button onClick={handleCodeClick} className="bg-fuchsia-50 hover:bg-fuchsia-100 p-5 rounded-[2.2rem] flex items-center gap-3 transition-all text-left group border border-fuchsia-100/50 hover:scale-[1.02] active:scale-95">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-fuchsia-600 group-hover:-rotate-12 transition-transform shadow-sm">
                            <Code size={20} />
                        </div>
                        <div>
                            <h4 className="font-black text-sm text-gray-900">Tokens</h4>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Neural JSON Export</p>
                        </div>
                    </button>
                    <button onClick={handleExportClick} className="bg-emerald-50 hover:bg-emerald-100 p-5 rounded-[2.2rem] flex items-center gap-3 transition-all text-left group border border-emerald-100/50 hover:scale-[1.02] active:scale-95">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-sm">
                            <Save size={20} />
                        </div>
                        <div>
                            <h4 className="font-black text-sm text-gray-900">Save</h4>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Snapshot</p>
                        </div>
                    </button>
                    <button onClick={handleAssetsClick} className="bg-amber-50 hover:bg-amber-100 p-5 rounded-[2.2rem] flex items-center gap-3 transition-all text-left group border border-amber-100/50 hover:scale-[1.02] active:scale-95">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-amber-600 group-hover:rotate-12 transition-transform shadow-sm">
                            <ImageIcon size={20} />
                        </div>
                        <div>
                            <h4 className="font-black text-sm text-gray-900">Assets</h4>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Generate</p>
                        </div>
                    </button>
                </div>

                {/* Main Studio Canvas */}
                <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden relative">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur z-10 sticky top-0 px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full border border-gray-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Live Studio</span>
                            </div>
                            <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Design Fidelity: 98%</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-2 text-[10px] items-center font-black text-gray-400 uppercase tracking-[0.2em] mr-4">
                                <span>Simulate</span>
                                <div className="w-8 h-4 bg-gray-100 rounded-full relative overflow-hidden ring-1 ring-gray-200">
                                    <div className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-violet-600 shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                                </div>
                            </div>
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-colors border border-gray-50 shadow-sm"
                                title="Expand Preview"
                            >
                                <Maximize2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50 relative p-4 lg:p-6 flex items-center justify-center">
                        {state.context.palette ? (
                            <div className="scale-[0.8] 2xl:scale-[0.85] origin-top h-full w-full">
                                <FeaturePreview
                                    key={state.design ? state.design.version_id : 'initial'}
                                    colors={state.context.palette}
                                    type={state.context.appType || 'general'}
                                    design={state.design}
                                />
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-20 h-20 bg-gray-100 rounded-[2.5rem] mx-auto mb-6 animate-pulse border border-gray-50 flex items-center justify-center">
                                    <Sparkles size={32} className="text-gray-200" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Awaiting Neural Projection</p>
                            </div>
                        )}
                    </div>

                    {/* Active Token Pill */}
                    {state.context.palette && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-gray-900 text-white shadow-2xl rounded-full flex items-center gap-3">
                            <div className="flex -space-x-1.5">
                                {state.context.palette.map(c => (
                                    <div key={c} className="w-4 h-4 rounded-full border border-gray-900 ring-1 ring-white/20" style={{ backgroundColor: c }} />
                                ))}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Active Genome</span>
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

        </div >
    );
}
