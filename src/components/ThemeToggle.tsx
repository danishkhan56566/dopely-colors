"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-9 h-9" /> // Placeholder to prevent layout shift
    }

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    const currentIcon = () => {
        switch (theme) {
            case 'dark': return <Moon size={18} className="text-white" />;
            case 'system': return <Monitor size={18} className="text-gray-500" />;
            default: return <Sun size={18} className="text-orange-500" />;
        }
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title={`Current theme: ${theme}`}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {currentIcon()}
                </motion.div>
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
