import React from 'react';

export function Layout({ children, headerExtra }) {
    return (
        <div className="min-h-screen bg-main text-primary font-sans selection:bg-accent selection:text-accent-text-contrast">
            <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-purple-500/30">
                            6
                        </div>
                        <h1 className="text-xl font-bold text-gradient-title">
                            ip6calc
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {headerExtra}
                        <a href="https://github.com/williamfinken/ip6calc" target="_blank" rel="noreferrer" className="text-muted hover:text-accent-pink transition-colors font-medium">
                            GitHub
                        </a>
                    </div>
                </div>
            </header>
            <main className="max-w-6xl mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="py-8 text-center text-secondary text-sm">
                <p>IPv6 Network Calculator MVP &copy; {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}
