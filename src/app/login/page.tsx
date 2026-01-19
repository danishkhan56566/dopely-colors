'use client';

import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Mail, Lock, Loader2, ArrowLeft, Github, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isSupabaseConfigured()) {
            toast.error("Authentication is not configured", {
                description: "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
            });
            return;
        }

        setIsLoading(true);

        if (password.length < 6) {
            toast.error("Password too short", { description: "Password must be at least 6 characters long." });
            setIsLoading(false);
            return;
        }

        try {
            if (mode === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;

                // Check if email confirmation is required
                if (data.user && !data.session) {
                    toast.success("Account created!", {
                        description: "Please check your email to confirm your account before logging in.",
                        duration: 8000, // Show for longer
                    });
                } else {
                    toast.success("Account created!", { description: "You can now log in." });
                }

                setMode('login'); // Switch to login after signup
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success("Welcome back!");
                router.push('/'); // Redirect to home
            }
        } catch (error: any) {
            console.error(error);
            let msg = error.message;
            if (msg.includes("Invalid login credentials")) {
                msg = "Invalid email or password. If you haven't created an account yet, please Sign Up first.";
            }
            toast.error("Authentication failed", { description: msg });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!isSupabaseConfigured()) {
            toast.error("Authentication is not configured");
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            toast.error("Google sign-in failed", { description: error.message });
        }
    };

    return (
        <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Generator
                </Link>

                <div className="bg-white rounded-[32px] shadow-xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                            P
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {mode === 'login' ? 'Welcome back' : 'Create an account'}
                        </h1>
                        <p className="text-gray-500 mt-2">
                            {mode === 'login'
                                ? 'Sign in to access your saved palettes'
                                : 'Join for free to save and share your work'}
                        </p>
                    </div>

                    {!isSupabaseConfigured() && (
                        <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                            <div className="text-sm text-amber-800">
                                <span className="font-bold">Configuration Missing:</span> You need to set valid Supabase keys in your environment variables to enable login.
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-400 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none rounded-xl transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-400 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none rounded-xl transition-all font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center gap-4 text-xs text-gray-400 font-medium uppercase tracking-wider">
                        <div className="h-px bg-gray-100 flex-1" />
                        <span>Or continue with</span>
                        <div className="h-px bg-gray-100 flex-1" />
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" /> Google
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm">
                        {mode === 'login' ? (
                            <>
                                <span className="text-gray-500">Don't have an account? </span>
                                <button onClick={() => setMode('signup')} className="font-bold text-blue-600 hover:underline">Sign up</button>
                            </>
                        ) : (
                            <>
                                <span className="text-gray-500">Already have an account? </span>
                                <button onClick={() => setMode('login')} className="font-bold text-blue-600 hover:underline">Log in</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
