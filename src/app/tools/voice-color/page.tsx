import { VoiceColorGuide } from '@/components/content/generated_guides/VoiceColorGuide';
'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';
import { Mic, MicOff, Volume2, Command, Palette, Wand2 } from 'lucide-react';
import chroma from 'chroma-js';
import { motion, AnimatePresence } from 'framer-motion';

// Web Speech API types
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export default function VoiceColorPage() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [palette, setPalette] = useState<string[]>(['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316']);
    const [feedback, setFeedback] = useState('Say "Random", "Darker", "Lighter", or a color name.');

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
            const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

            if (SpeechRecognitionConstructor) {
                const recognition = new SpeechRecognitionConstructor();
                recognition.continuous = true;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onresult = (event: any) => {
                    const lastResult = event.results[event.results.length - 1];
                    const text = lastResult[0].transcript.trim().toLowerCase();
                    setTranscript(text);
                    processCommand(text);
                };

                recognition.onerror = (event: any) => {
                    console.error("Speech error", event);
                    setIsListening(false);
                    setFeedback("Microphone access error or denied.");
                };

                recognition.onend = () => {
                    // Auto-restart if we think we should still be listening, 
                    // providing a "always on" feel until manually stopped.
                    // But for safety, let's just sync state.
                    if (isListening) {
                        // recognition.start(); // Optional: aggressive restart
                        setIsListening(false);
                    }
                };

                recognitionRef.current = recognition;
            } else {
                setFeedback("Voice API not supported in this browser (Try Chrome).");
            }
        }
    }, [isListening]); // Re-bind if needed, but mostly static

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                setFeedback("Listening... Say a command!");
            } catch (e) {
                console.error(e);
            }
        }
    };

    const processCommand = (cmd: string) => {
        let newPalette = [...palette];
        let action = '';

        // 1. "Random" / "Generate"
        if (cmd.includes('random') || cmd.includes('generate') || cmd.includes('shuffle')) {
            newPalette = chroma.scale([chroma.random(), chroma.random()]).mode('lch').colors(5);
            action = 'Generated Random Palette';
        }
        // 2. "Darker"
        else if (cmd.includes('darker') || cmd.includes('darken')) {
            newPalette = palette.map(c => chroma(c).darken(0.3).hex());
            action = 'Darkened';
        }
        // 3. "Lighter" / "Brighter"
        else if (cmd.includes('lighter') || cmd.includes('brighten')) {
            newPalette = palette.map(c => chroma(c).brighten(0.3).hex());
            action = 'Brightened';
        }
        // 4. "Saturate" / "Vibrant"
        else if (cmd.includes('saturate') || cmd.includes('vibrant')) {
            newPalette = palette.map(c => chroma(c).saturate(0.5).hex());
            action = 'Increased Saturation';
        }
        // 5. "Desaturate" / "Grayscale"
        else if (cmd.includes('desaturate') || cmd.includes('gray')) {
            newPalette = palette.map(c => chroma(c).desaturate(1).hex());
            action = 'Desaturated';
        }
        // 6. "Warmer" (Shift hue towards red/orange/yellow)
        else if (cmd.includes('warmer')) {
            // Heuristic: If blue-ish, move to purple/red. If green, move to yellow.
            // Simple hack: overlay orange
            newPalette = palette.map(c => chroma.mix(c, 'orange', 0.1).hex());
            action = 'Warmed up';
        }
        // 7. "Cooler" (Shift hue towards blue/cyan)
        else if (cmd.includes('cooler')) {
            newPalette = palette.map(c => chroma.mix(c, 'blue', 0.1).hex());
            action = 'Cooled down';
        }
        // 8. Specific Colors? "Make it [Color]"
        else {
            const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'magenta', 'teal', 'black', 'white'];
            const foundColor = colors.find(c => cmd.includes(c));
            if (foundColor) {
                newPalette = chroma.scale([foundColor, 'white']).mode('lch').colors(5).slice(0, 5).map((c: string) => {
                    // Keep some variation
                    return chroma(foundColor).set('hsl.l', Math.random() * 0.8 + 0.1).hex();
                });
                // Sort by luminance for looks
                newPalette.sort((a, b) => chroma(b).luminance() - chroma(a).luminance());
                action = `Generated ${foundColor} theme`;
            } else {
                action = 'Command not understood (Try "Darker", "Random", "Blue")';
            }
        }

        if (action) {
            setPalette(newPalette);
            setFeedback(action);
        }
    };

    return (
        <PremiumToolLayout
            guide={<VoiceColorGuide />}
            hideHeader={true}
            title="Voice to Color Generator"
            description="Speak your mood, context, or project brief into the microphone and watch our NLP artificial intelligence generate the perfect palette."
            icon={Wand2}
            badgeText="Tool"
        >
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

                {/* Background Aura */}
                <div
                    className="absolute inset-0 opacity-30 blur-[100px] transition-colors duration-1000 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${palette[0]}, ${palette[2]})` }}
                />

                <div className="max-w-2xl w-full relative z-10 text-center space-y-12">

                    <header>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md border border-white/10">
                            <Mic size={14} /> Voice Command
                        </div>
                        <h1 className="text-5xl font-black tracking-tight mb-4">Voice Studio</h1>
                        <p className="text-xl text-gray-400">
                            Control colors with your voice. Speak naturally.
                        </p>
                    </header>

                    {/* Palette Visualization */}
                    <div className="h-40 flex rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
                        {palette.map((color, i) => (
                            <motion.div
                                key={i}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, backgroundColor: color }}
                                transition={{ duration: 0.5 }}
                                className="flex-1 flex items-end justify-center pb-4"
                            >
                                <span className="text-[10px] font-mono opacity-50 bg-black/20 px-1 rounded uppercase">{color}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Voice Controls */}
                    <div className="flex flex-col items-center gap-6">

                        <div className="h-12 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={feedback}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="text-lg font-medium text-white/90"
                                >
                                    {feedback}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={toggleListening}
                            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] scale-110' : 'bg-white/10 hover:bg-white/20 border-2 border-white/10'}`}
                        >
                            {isListening ? (
                                <Mic size={40} className="text-white animate-pulse" />
                            ) : (
                                <MicOff size={32} className="text-gray-400" />
                            )}
                        </button>

                        {isListening && (
                            <div className="text-sm text-gray-500 font-mono animate-pulse">
                                {transcript || "Listening..."}
                            </div>
                        )}

                        {!isListening && (
                            <div className="text-xs text-gray-500">
                                Click to start listening
                            </div>
                        )}
                    </div>

                    {/* Cheat Sheet */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-400 border-t border-white/10 pt-8 mt-8">
                        <div className="space-y-1">
                            <strong className="text-white block mb-1">Generators</strong>
                            <p>"Random"</p>
                            <p>"Generate"</p>
                        </div>
                        <div className="space-y-1">
                            <strong className="text-white block mb-1">Adjustments</strong>
                            <p>"Lighter" / "Darker"</p>
                            <p>"Warmer" / "Cooler"</p>
                        </div>
                        <div className="space-y-1">
                            <strong className="text-white block mb-1">Saturation</strong>
                            <p>"Vibrant"</p>
                            <p>"Desaturate"</p>
                        </div>
                        <div className="space-y-1">
                            <strong className="text-white block mb-1">Specifics</strong>
                            <p>"Make it Blue"</p>
                            <p>"Neon Purple"</p>
                        </div>
                    </div>

                </div>

            </div>
        </PremiumToolLayout>
    );
}
