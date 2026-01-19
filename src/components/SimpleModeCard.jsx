import React from 'react';

export function SimpleModeCard({ content, className = '' }) {
    if (!content) return null;

    return (
        <div className={`glass-card rounded-xl p-4 shadow-lg border-l-4 border-l-accent-yellow ${className}`}>
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/30 to-amber-500/20 flex items-center justify-center border border-yellow-500/30 shrink-0">
                    <span className="text-lg">💡</span>
                </div>
                <div className="space-y-2 flex-1">
                    <h3 className="font-bold text-primary text-base flex items-center gap-2">
                        <span className="text-gradient-yellow">{content.title}</span>
                    </h3>
                    <p className="text-secondary text-sm leading-relaxed">
                        {content.simple_explanation}
                    </p>

                </div>
            </div>
        </div>
    );
}
