'use client';

import { useEffect } from 'react';

// IMMEDIATE PATCH: Execute as soon as this module is imported to catch early errors
if (typeof window !== 'undefined') {
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
        const msg = args.join(' ');
        if (
            msg.includes('AbortError') ||
            msg.includes('signal is aborted') ||
            msg.includes('The user aborted a request')
        ) {
            return;
        }
        originalConsoleError.apply(console, args);
    };

    // Also patch window.onerror directly for good measure
    const originalOnError = window.onerror;
    window.onerror = (msg, url, line, col, error) => {
        if (
            String(msg).includes('AbortError') ||
            String(msg).includes('signal is aborted') ||
            error?.name === 'AbortError'
        ) {
            return true; // Suppress
        }
        return originalOnError ? originalOnError(msg, url, line, col, error) : false;
    };
}

/**
 * This component keeps the listeners active and helps with React-lifecycle specific rejections
 */
export function ClientErrorSuppressor() {
    useEffect(() => {
        const isAbortError = (error: any) => {
            return (
                error?.name === 'AbortError' ||
                error?.message?.includes('aborted') ||
                error?.message?.includes('AbortError') ||
                error === 'AbortError' ||
                error?.cause?.name === 'AbortError'
            );
        };

        const rejectionHandler = (event: PromiseRejectionEvent) => {
            if (isAbortError(event.reason)) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        const errorHandler = (event: ErrorEvent) => {
            if (isAbortError(event.error) || event.message?.includes('aborted')) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        window.addEventListener('unhandledrejection', rejectionHandler);
        window.addEventListener('error', errorHandler);

        return () => {
            window.removeEventListener('unhandledrejection', rejectionHandler);
            window.removeEventListener('error', errorHandler);
        };
    }, []);

    return null;
}
