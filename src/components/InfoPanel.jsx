import React from 'react';
import { getContext } from '../utils/knowledgeBase';
import { SimpleModeCard } from './SimpleModeCard';

export function InfoPanel({ type, isSimpleMode, simpleTypeContent }) {
    if (!type) return null;

    const data = getContext(type);

    return (
        <div className="glass-card rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-primary flex items-center gap-3">
                <span className="w-1 h-6 accent-bar-purple rounded-full"></span>
                <span className="text-2xl">{data.icon}</span>
                <span className="text-accent">{data.title}</span>
            </h2>
            {isSimpleMode && simpleTypeContent && (
                <div className="mb-4 animate-fade-in">
                    <SimpleModeCard content={simpleTypeContent} />
                </div>
            )}
            <div className="space-y-4 text-secondary">
                <p className="leading-relaxed">
                    {data.description}
                </p>
                <div className="bg-element/30 rounded-lg p-3 border border-element/50">
                    <strong className="text-muted text-xs uppercase tracking-wide block mb-1">Common Usage</strong>
                    <div className="text-sm">{data.usage}</div>
                </div>
            </div>
        </div>
    );
}
