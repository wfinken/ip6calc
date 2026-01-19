import React from 'react';

export function SimpleModeToggle({ isSimpleMode, onToggle }) {
    return (
        <div className="flex items-center bg-element/80 border border-border rounded-xl backdrop-blur-sm">
            <button
                onClick={() => onToggle(false)}
                className={`px-4 py-2 rounded-l-xl text-sm font-semibold transition-all duration-300 border-r border-border ${!isSimpleMode
                    ? 'bg-card text-primary shadow-inner'
                    : 'text-muted hover:text-primary'
                    }`}
            >
                Engineer
            </button>
            <button
                onClick={() => onToggle(true)}
                className={`px-4 py-2 rounded-r-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${isSimpleMode
                    ? 'bg-card text-primary shadow-inner'
                    : 'text-muted hover:text-primary'
                    }`}
            >
                <span>Simple</span>
                {isSimpleMode && <span>🎯</span>}
            </button>
        </div>
    );
}
