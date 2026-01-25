'use client';

import Script from 'next/script';

export function ErrorSuppressorScript() {
    return (
        <Script id="error-suppressor" strategy="beforeInteractive">
            {`
        (function() {
          var origConsoleError = console.error;
          console.error = function() {
            var args = Array.from(arguments);
            var msg = args.join(' ');
            if (
              msg.includes('AbortError') || 
              msg.includes('signal is aborted') || 
              msg.includes('The user aborted a request')
            ) {
              return;
            }
            origConsoleError.apply(console, args);
          };
          
          window.addEventListener('error', function(e) {
            if (e.message && (e.message.includes('AbortError') || e.message.includes('signal is aborted'))) {
              e.preventDefault();
              e.stopImmediatePropagation();
            }
          });

          window.addEventListener('unhandledrejection', function(e) {
            var err = e.reason;
            if (
                err && (
                err.name === 'AbortError' || 
                (err.message && (err.message.includes('aborted') || err.message.includes('AbortError'))) ||
                startWith(String(err), 'AbortError')
                )
            ) {
              e.preventDefault();
              e.stopImmediatePropagation();
            }
          });
          
          function startWith(str, prefix) {
            return str.indexOf(prefix) === 0;
          }
        })();
      `}
        </Script>
    );
}
