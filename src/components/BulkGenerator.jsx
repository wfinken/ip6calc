import React, { useState } from 'react';
import { IPv6Address } from '../utils/ipv6';

export function BulkGenerator({ startAddress, cidr }) {
    const [count, setCount] = useState(10);
    const [generatedList, setGeneratedList] = useState([]);

    const generate = () => {
        try {
            const list = [];
            let currentBigInt = new IPv6Address(startAddress).bigInt;

            for (let i = 0; i < count; i++) {
                const addr = IPv6Address.fromBigInt(currentBigInt);
                list.push(addr.canonical);
                currentBigInt += 1n;
            }
            setGeneratedList(list);
        } catch (e) {
            console.error("Bulk generation error:", e);
        }
    };

    const downloadCSV = () => {
        const content = "Address\n" + generatedList.join("\n");
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ipv6-bulk-${count}.csv`;
        a.click();
    };

    const downloadJSON = () => {
        const content = JSON.stringify(generatedList, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ipv6-bulk-${count}.json`;
        a.click();
    };

    return (
        <div className="glass-card rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-primary flex items-center gap-3">
                <span className="w-1 h-6 accent-bar-orange rounded-full"></span>
                <span className="text-accent-orange">Bulk Generator</span>
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-secondary text-sm font-medium mb-1">
                        Number of Addresses to Generate
                    </label>
                    <div className="flex gap-4">
                        <input
                            type="number"
                            min="1"
                            max="1000"
                            value={count}
                            onChange={(e) => setCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 0)))}
                            className="flex-1 bg-main border border-element rounded-lg px-4 py-2 text-primary font-mono placeholder-muted focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                        />
                        <button
                            onClick={generate}
                            className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-orange-500/20"
                        >
                            Generate
                        </button>
                    </div>
                </div>

                {generatedList.length > 0 && (
                    <div className="bg-main/50 rounded-lg p-3 group relative animate-fade-in">
                        <div className="flex justify-between items-center mb-2 border-b border-element/50 pb-2">
                            <span className="text-xs text-muted uppercase tracking-wider">Preview ({generatedList.length})</span>
                            <div className="flex gap-2">
                                <button onClick={downloadCSV} className="text-xs text-orange-400 hover:text-orange-300">Export CSV</button>
                                <button onClick={downloadJSON} className="text-xs text-orange-400 hover:text-orange-300">Export JSON</button>
                            </div>
                        </div>
                        <div className="font-mono text-primary text-sm max-h-40 overflow-y-auto">
                            {generatedList.map((addr, i) => (
                                <div key={i}>{addr}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
