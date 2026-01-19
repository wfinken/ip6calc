import React, { useMemo } from 'react';

export function BitExplorer({ ipv6, cidr }) {
    // Convert BigInt to binary string (128 chars)
    const binaryString = useMemo(() => {
        if (!ipv6) return '';
        return ipv6.bigInt.toString(2).padStart(128, '0');
    }, [ipv6]);

    return (
        <div className="glass-card rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-primary flex items-center gap-3">
                <span className="w-1 h-6 accent-bar-cyan rounded-full"></span>
                <span className="text-accent-cyan">Bit Explorer</span>
            </h2>

            <div className="mb-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-gradient-to-br from-purple-600/80 to-violet-600/60 border border-purple-500/40"></span>
                    <span className="text-secondary">Network Bits (/{cidr})</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-element/50 border border-element/50"></span>
                    <span className="text-secondary">Host Bits</span>
                </div>
            </div>

            <div className="grid grid-cols-16 gap-1 md:gap-x-2 md:gap-y-1 font-mono text-center">
                {Array.from({ length: 128 }).map((_, i) => {
                    const bit = binaryString[i] || '0';
                    const isNetwork = i < cidr;

                    // Grouping markers
                    const isByteStart = i % 8 === 0;
                    const isWordStart = i % 16 === 0;

                    return (
                        <div
                            key={i}
                            className={`
                 relative
                 w-full aspect-square md:aspect-auto md:h-8 
                 flex items-center justify-center
                 text-xs md:text-sm font-bold
                 rounded-md
                 transition-all duration-300
                 ${isNetwork
                                    ? 'bg-linear-to-br from-purple-600/30 to-violet-600/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20'
                                    : 'bg-element/30 text-muted/70 border border-element/30'}
                 ${i === cidr - 1 ? 'ring-2 ring-pink-500/50' : ''}
               `}
                            title={`Bit ${i}: ${bit} (${isNetwork ? 'Network' : 'Host'})`}
                        >
                            {bit}
                            {/* Visual separators for words (16 bits) */}
                            {isWordStart && i !== 0 && (
                                <div className="absolute -left-1 md:-left-1.5 top-0 bottom-0 w-px bg-border"></div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 text-xs text-muted flex justify-between font-mono">
                <span>0</span>
                <span>31</span>
                <span>63</span>
                <span>95</span>
                <span>127</span>
            </div>
        </div>
    );
}
