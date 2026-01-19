import React, { useState } from 'react';

export function EUI64Visualizer() {
    const [mac, setMac] = useState('00:0c:29:ab:cd:ef');
    const [step, setStep] = useState(0);

    const steps = [
        { title: "Start with MAC Address", desc: "Start with the 48-bit MAC address." },
        { title: "Split in Half", desc: "Split the MAC address into two 24-bit halves (OUI and NIC)." },
        { title: "Insert FF:FE", desc: "Insert the reserved value 0xFFFE in the middle." },
        { title: "Invert Universal/Local Bit", desc: "Flip the 7th bit of the first byte (from 0 to 1, or 1 to 0)." },
        { title: "Combine with Prefix", desc: "Append the result to the FE80::/64 prefix." }
    ];

    const cleanMac = mac.replace(/[^0-9a-fA-F]/g, '').padEnd(12, '0');
    const part1 = cleanMac.slice(0, 6);
    const part2 = cleanMac.slice(6, 12);

    // Invert U/L Bit Logic
    const firstByteVal = parseInt(cleanMac.slice(0, 2), 16);
    const invertedByteVal = firstByteVal ^ 2; // Flip 2nd least significant bit of first hex pair? No, 7th bit from left. 
    // 0000 0000 -> 7th bit is the 2nd bit from right: 0000 0010.
    // 0x02. XOR with 0x02.
    const invertedByteHex = invertedByteVal.toString(16).padStart(2, '0');

    const renderVisual = () => {
        const hexStyle = "font-mono text-2xl font-bold transition-all duration-500";

        switch (step) {
            case 0:
                return (
                    <div className="flex gap-2 items-center justify-center p-8 bg-main rounded-xl">
                        <span className={`${hexStyle} text-secondary`}>{part1.match(/.{1,2}/g).join(':')}</span>
                        <span className={`${hexStyle} text-secondary`}>:</span>
                        <span className={`${hexStyle} text-secondary`}>{part2.match(/.{1,2}/g).join(':')}</span>
                    </div>
                );
            case 1:
                return (
                    <div className="flex gap-8 items-center justify-center p-8 bg-main rounded-xl">
                        <div className="bg-blue-500/20 p-2 rounded border border-blue-500/50">
                            <span className={`${hexStyle} text-blue-400`}>{part1.match(/.{1,2}/g).join(':')}</span>
                        </div>
                        <div className="bg-green-500/20 p-2 rounded border border-green-500/50">
                            <span className={`${hexStyle} text-green-400`}>{part2.match(/.{1,2}/g).join(':')}</span>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="flex gap-2 items-center justify-center p-8 bg-main rounded-xl">
                        <span className={`${hexStyle} text-blue-400`}>{part1.slice(0, 2)}:{part1.slice(2, 4)}:{part1.slice(4)}</span>
                        <div className="animate-bounce">
                            <span className={`${hexStyle} text-yellow-400`}>ff:fe</span>
                        </div>
                        <span className={`${hexStyle} text-green-400`}>{part2.slice(0, 2)}:{part2.slice(2, 4)}:{part2.slice(4)}</span>
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col items-center justify-center p-8 bg-main rounded-xl gap-4">
                        <div className="flex gap-2">
                            <div className="relative">
                                <span className={`${hexStyle} text-red-500 line-through decoration-2`}>{part1.slice(0, 2)}</span>
                                <span className="absolute -top-6 left-0 text-xs text-red-400">Flip UL Bit</span>
                            </div>
                            <span className={`${hexStyle} text-blue-400`}>{part1.slice(2, 4)}:{part1.slice(4)}</span>
                            <span className={`${hexStyle} text-yellow-400`}>:ff:fe:</span>
                            <span className={`${hexStyle} text-green-400`}>{part2.slice(0, 2)}:{part2.slice(2, 4)}:{part2.slice(4)}</span>
                        </div>
                        <div className="text-xl font-mono text-purple-400">
                            {part1.slice(0, 2)} (hex) = {parseInt(part1.slice(0, 2), 16).toString(2).padStart(8, '0')}<br />
                            {invertedByteHex} (hex) = {parseInt(invertedByteHex, 16).toString(2).padStart(8, '0')}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="flex gap-1 items-center justify-center p-8 bg-main rounded-xl flex-wrap">
                        <span className={`${hexStyle} text-muted`}>fe80::</span>
                        <span className={`${hexStyle} text-accent`}>{invertedByteHex}{part1.slice(2, 4)}</span>
                        <span className={`${hexStyle} text-secondary`}>:</span>
                        <span className={`${hexStyle} text-yellow-400`}>{part1.slice(4)}ff:fe{part2.slice(0, 2)}</span>
                        <span className={`${hexStyle} text-secondary`}>:</span>
                        <span className={`${hexStyle} text-green-400`}>{part2.slice(2, 4)}{part2.slice(4)}</span>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className="glass-card rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-primary flex items-center gap-3">
                <span className="w-1 h-6 accent-bar-blue rounded-full"></span>
                <span className="text-accent-blue">EUI-64 Visualizer</span>
            </h2>

            <div className="mb-6">
                <label className="block text-secondary text-sm font-medium mb-1">
                    MAC Address
                </label>
                <input
                    type="text"
                    value={mac}
                    onChange={(e) => setMac(e.target.value)}
                    className="w-full bg-main border border-element rounded-lg px-4 py-2 text-primary font-mono placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                />
            </div>

            <div className="mb-6">
                {renderVisual()}
            </div>

            <div className="flex justify-between items-center bg-main/50 p-4 rounded-xl">
                <button
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    className="px-4 py-2 bg-element rounded-lg text-primary disabled:opacity-50 hover:bg-element/80 transition-colors"
                >
                    Previous
                </button>
                <div className="text-center">
                    <div className="text-primary font-bold">{steps[step].title}</div>
                    <div className="text-secondary text-sm">{steps[step].desc}</div>
                </div>
                <button
                    onClick={() => setStep(Math.min(4, step + 1))}
                    disabled={step === 4}
                    className="px-4 py-2 bg-purple-600 rounded-lg text-white disabled:opacity-50 hover:bg-purple-500 transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
