import React, { useState } from 'react';
import { SimpleModeCard } from './SimpleModeCard';

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="ml-2 p-1.5 text-secondary hover:text-primary rounded-md hover:bg-element transition-colors shrink-0"
            title="Copy to clipboard"
        >
            {copied ? (
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            )}
        </button>
    );
}

function HexChar({ char }) {
    const isHex = /^[0-9a-fA-F]$/.test(char);
    if (!isHex) return <span>{char}</span>;

    const binary = parseInt(char, 16).toString(2).padStart(4, '0');

    return (
        <span className="relative group cursor-help hover:text-accent transition-colors">
            {char}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-main text-accent text-xs rounded border border-element opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                {binary}
            </span>
        </span>
    );
}

function DetailRow({ label, value, subValue, simpleContent, isSimpleMode, accent = 'pink' }) {
    const accentStyles = {
        pink: { bar: 'accent-bar-pink', text: 'text-accent-pink' },
        cyan: { bar: 'accent-bar-cyan', text: 'text-accent-cyan' },
        purple: { bar: 'accent-bar-purple', text: 'text-accent' },
        orange: { bar: 'accent-bar-orange', text: 'text-accent-orange' },
        green: { bar: 'accent-bar-green', text: 'text-accent-green' },
        blue: { bar: 'accent-bar-blue', text: 'text-accent-blue' },
    };
    const style = accentStyles[accent] || accentStyles.pink;

    return (
        <div className="glass-card rounded-xl p-4 space-y-3">
            <div>
                <div className={`text-xs font-bold ${style.text} uppercase tracking-wider mb-2 flex items-center gap-2`}>
                    <span className={`w-1 h-4 ${style.bar} rounded-full`}></span>
                    {label}
                </div>
                <div className="flex items-start justify-between group">
                    <div className="font-mono text-sm break-all text-primary">
                        {value}
                        {subValue && <div className="text-muted text-xs mt-1">{subValue}</div>}
                    </div>
                    <CopyButton text={value} />
                </div>
            </div>
            {isSimpleMode && simpleContent && (
                <div className="animate-fade-in">
                    <SimpleModeCard content={simpleContent} />
                </div>
            )}
        </div>
    );
}

export function AddressDetails({ ipv6, subnet, isSimpleMode, simpleData }) {
    if (!ipv6) return null; // Should not happen if parent handles error

    const [expanded, setExpanded] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            {/* Address Formats */}
            <div className="glass-card rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="text-xs font-semibold text-muted uppercase tracking-wider">Address Format</div>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-xs text-accent hover:text-accent-glow transition-colors"
                    >
                        {expanded ? "Show Compressed" : "Show Expanded"}
                    </button>
                    {/* Explain compression/expansion */}
                </div>
                <div className="flex items-center justify-between">
                    <div className="font-mono text-lg text-primary break-all flex flex-wrap gap-0.5">
                        {/* {expanded ? ipv6.expanded : ipv6.canonical} */}
                        {(expanded ? ipv6.expanded : ipv6.canonical).split('').map((char, idx) => (
                            <HexChar key={idx} char={char} />
                        ))}
                    </div>
                    <CopyButton text={expanded ? ipv6.expanded : ipv6.canonical} />
                </div>
                {isSimpleMode && (
                    <div className="animate-fade-in grid gap-2">
                        {expanded ? (
                            <SimpleModeCard content={simpleData?.expanded_form} />
                        ) : (
                            <SimpleModeCard content={simpleData?.canonical_form} />
                        )}
                    </div>
                )}
            </div>

            {
                subnet && (
                    <>
                        <DetailRow
                            label="Network Start"
                            value={subnet.startAddress.canonical}
                            subValue={subnet.startAddress.expanded}
                            simpleContent={simpleData?.network_range}
                            isSimpleMode={isSimpleMode}
                            accent="cyan"
                        />
                        <DetailRow
                            label="Network End"
                            value={subnet.endAddress.canonical}
                            subValue={subnet.endAddress.expanded}
                            simpleContent={null} // Don't duplicate the explanation
                            isSimpleMode={isSimpleMode}
                            accent="purple"
                        />
                        <DetailRow
                            label="Total Hosts"
                            value={subnet.hostsCount.toString()}
                            subValue={subnet.hostsCount > 1000n ? subnet.hostsCount.toString(10) : null}
                            simpleContent={simpleData?.total_hosts}
                            isSimpleMode={isSimpleMode}
                            accent="orange"
                        />
                    </>
                )
            }
        </div >
    );
}
