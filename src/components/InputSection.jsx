import React from 'react';

export function InputSection({ address, setAddress, cidr, setCidr, error, type }) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-secondary">
                    IPv6 Address
                </label>
                <div className="relative">
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={`w-full bg-card border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-element focus:border-accent'
                            } rounded-xl px-4 py-3 text-lg font-mono text-primary placeholder-muted focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500' : 'focus:ring-accent'
                            } transition-all shadow-input`}
                        placeholder="2001:db8::1"
                        autoComplete="off"
                        spellCheck="false"
                    />
                    {type && !error && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-element/50 rounded text-xs font-medium text-secondary border border-element">
                            {type}
                        </div>
                    )}
                </div>
                {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label htmlFor="cidr" className="text-sm font-medium text-secondary">
                        CIDR Prefix Length
                    </label>
                    <span className="text-accent font-mono font-bold">/{cidr}</span>
                </div>
                <div className="flex items-center gap-4">
                    <input
                        id="cidr-slider"
                        type="range"
                        min="0"
                        max="128"
                        value={cidr}
                        onChange={(e) => setCidr(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-element rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                    <input
                        id="cidr-number"
                        type="number"
                        min="0"
                        max="128"
                        value={cidr}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= 0 && val <= 128) setCidr(val);
                        }}
                        className="w-16 bg-card border border-element rounded-lg px-2 py-1 text-center font-mono text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                </div>
            </div>
        </div>
    );
}
