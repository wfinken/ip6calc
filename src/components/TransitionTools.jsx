import React, { useState, useEffect } from 'react';
import { IPv6Address } from '../utils/ipv6';

export function TransitionTools() {
    const [ipv4, setIpv4] = useState('');
    const [isatapPrefix, setIsatapPrefix] = useState('fe80::');
    const [results, setResults] = useState({ nat64: '', to6to4: '', isatap: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!ipv4) {
            setResults({ nat64: '', to6to4: '', isatap: '' });
            setError(null);
            return;
        }

        try {
            const nat64 = IPv6Address.createNAT64(ipv4).canonical;
            const to6to4 = IPv6Address.create6to4(ipv4).canonical;
            const isatap = IPv6Address.createISATAP(ipv4, isatapPrefix).canonical;

            setResults({ nat64, to6to4, isatap });
            setError(null);
        } catch (e) {
            setError(e.message);
            setResults({ nat64: '', to6to4: '', isatap: '' });
        }
    }, [ipv4, isatapPrefix]);

    return (
        <div className="glass-card rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-primary flex items-center gap-3">
                <span className="w-1 h-6 accent-bar-cyan rounded-full"></span>
                <span className="text-accent-cyan">IPv4 Transition Tools</span>
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-secondary text-sm font-medium mb-1">
                        IPv4 Address
                    </label>
                    <input
                        type="text"
                        value={ipv4}
                        onChange={(e) => setIpv4(e.target.value)}
                        placeholder="192.0.2.1"
                        className={`
                            w-full bg-main border rounded-lg px-4 py-2 text-primary font-mono placeholder-muted focus:outline-none focus:ring-2 transition-all
                            ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-element focus:ring-teal-500/50'}
                        `}
                    />
                    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                </div>

                <div>
                    <label className="block text-secondary text-sm font-medium mb-1">
                        ISATAP Prefix (Optional)
                    </label>
                    <input
                        type="text"
                        value={isatapPrefix}
                        onChange={(e) => setIsatapPrefix(e.target.value)}
                        placeholder="fe80::"
                        className="w-full bg-main border border-element rounded-lg px-4 py-2 text-primary font-mono placeholder-muted focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                    />
                </div>

                {(results.nat64 || results.to6to4) && (
                    <div className="space-y-3 pt-2">
                        <ResultRow label="NAT64 (64:ff9b::/96)" value={results.nat64} />
                        <ResultRow label="6to4 (2002::/16)" value={results.to6to4} />
                        <ResultRow label="ISATAP" value={results.isatap} />
                    </div>
                )}
            </div>
        </div>
    );
}

function ResultRow({ label, value }) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
    };

    return (
        <div className="bg-main/50 rounded-lg p-3 group relative">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted uppercase tracking-wider">{label}</span>
                <button
                    onClick={copyToClipboard}
                    className="text-muted hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2-2h-8a2 2 0 01-2 2v8a2 2 0 012 2z" /></svg>
                </button>
            </div>
            <div className="font-mono text-teal-400 break-all select-all">
                {value}
            </div>
        </div>
    );
}
