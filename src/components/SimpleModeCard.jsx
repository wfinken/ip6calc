import React from 'react';

export function SimpleModeCard({ content, className = '' }) {
    if (!content) return null;

    return (
        <div className={`bg-accent/10 border border-accent/20 p-4 rounded-xl shadow-sm backdrop-blur-sm ${className}`}>
            <div className="flex items-start gap-3">
                <div className="text-xl mt-0.5 opacity-80">💡</div>
                <div className="space-y-2 flex-1">
                    <h3 className="font-semibold text-primary text-base">{content.title}</h3>
                    <p className="text-secondary text-sm leading-relaxed font-normal">
                        {content.simple_explanation}
                    </p>
                    {content.metaphor && (
                        <div className="mt-3 bg-element/40 p-3 rounded-lg border border-accent/10 italic text-muted text-sm relative">
                            <span className="absolute -top-2 -left-1 text-2xl text-accent/20 font-serif">"</span>
                            <p className="relative z-10 pl-2">{content.metaphor}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
