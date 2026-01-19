import React, { useState, useEffect } from 'react';

export function ConfigGenerator({ address, cidr }) {
    const [vendor, setVendor] = useState('cisco');
    const [interfaceName, setInterfaceName] = useState('GigabitEthernet0/1');
    const [config, setConfig] = useState('');

    useEffect(() => {
        if (!address) {
            setConfig('');
            return;
        }

        let snippet = '';
        switch (vendor) {
            case 'cisco':
                snippet = `interface ${interfaceName}
 ipv6 address ${address}/${cidr}
 no shutdown
 exit`;
                break;
            case 'juniper':
                snippet = `set interfaces ${interfaceName} unit 0 family inet6 address ${address}/${cidr}`;
                break;
            case 'linux':
                snippet = `ip addr add ${address}/${cidr} dev ${interfaceName}
ip link set ${interfaceName} up`;
                break;
            case 'arista':
                snippet = `interface ${interfaceName}
 ipv6 address ${address}/${cidr}`;
                break;
            default:
                snippet = '';
        }
        setConfig(snippet);
    }, [address, cidr, vendor, interfaceName]);

    return (
        <div className="glass-card rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-primary flex items-center gap-3">
                <span className="w-1 h-6 accent-bar-blue rounded-full"></span>
                <span className="text-gradient-blue">Config Generator</span>
            </h2>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-secondary text-sm font-medium mb-1">
                            Vendor
                        </label>
                        <select
                            value={vendor}
                            onChange={(e) => setVendor(e.target.value)}
                            className="w-full bg-main border border-element rounded-lg px-4 py-2 text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                        >
                            <option value="cisco">Cisco IOS</option>
                            <option value="juniper">Juniper Junos</option>
                            <option value="arista">Arista EOS</option>
                            <option value="linux">Linux (iproute2)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-secondary text-sm font-medium mb-1">
                            Interface Name
                        </label>
                        <input
                            type="text"
                            value={interfaceName}
                            onChange={(e) => setInterfaceName(e.target.value)}
                            className="w-full bg-main border border-element rounded-lg px-4 py-2 text-primary font-mono placeholder-muted focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="bg-main/80 border border-accent-pink/20 rounded-xl p-4 group relative">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-accent-pink uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1 h-3 accent-bar-cyan rounded-full"></span>
                            Generated Config
                        </span>
                        <button
                            onClick={() => navigator.clipboard.writeText(config)}
                            className="text-muted hover:text-accent-cyan opacity-0 group-hover:opacity-100 transition-all"
                            title="Copy"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2-2h-8a2 2 0 01-2 2v8a2 2 0 012 2z" /></svg>
                        </button>
                    </div>
                    <pre className="font-mono text-cyan-400 text-sm whitespace-pre-wrap break-all select-all">
                        {config}
                    </pre>
                </div>
            </div>
        </div>
    );
}
