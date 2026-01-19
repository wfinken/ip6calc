import React, { useState } from 'react';
import { IPv6Address, IPv6Subnet } from '../utils/ipv6';

export function SubnetTree({ rootAddress, rootCidr }) {
    const [expandedNodes, setExpandedNodes] = useState({});

    // Normalize inputs
    if (!rootAddress || rootCidr === undefined) return null;

    // Helper to calculate next level subnets
    const getSubnets = (address, currentCidr) => {
        // Define hierarchy steps: /48 -> /52 -> /56 -> /64
        // If current is /48, next is /52. Diff = 4 bits -> 16 subnets.
        // If /52, next /56. Diff 4.
        // If /56, next /64. Diff 8. (256 subnets - might be too many to show at once? Limit?)

        let nextCidr;
        if (currentCidr >= 64) return []; // Stop at /64

        if (currentCidr < 48) nextCidr = 48;
        else if (currentCidr < 52) nextCidr = 52;
        else if (currentCidr < 56) nextCidr = 56;
        else nextCidr = 64;

        const diff = BigInt(nextCidr - currentCidr);
        // Safety cap: don't render thousands of nodes if jump is huge
        if (diff > 8n) return [];

        const count = 1n << diff;
        const subnets = [];
        const blockSize = 1n << (128n - BigInt(nextCidr));

        // Start address bigInt
        let currentBigInt = new IPv6Address(address).bigInt;

        // Align to boundary? Assume address passed is valid start of block.

        for (let i = 0n; i < count; i++) {
            const addr = IPv6Address.fromBigInt(currentBigInt);
            subnets.push({
                address: addr.canonical,
                netmask: nextCidr,
                key: `${addr.canonical}/${nextCidr}`
            });
            currentBigInt += blockSize;
        }
        return subnets;
    };

    const toggleNode = (key) => {
        setExpandedNodes(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const TreeNode = ({ address, cidr, level = 0 }) => {
        const uniqueKey = `${address}/${cidr}`;
        const isExpanded = expandedNodes[uniqueKey];
        const canExpand = cidr < 64;

        const children = isExpanded ? getSubnets(address, cidr) : [];

        // Colors for depth
        const colors = [
            'border-pink-500/50 hover:bg-pink-500/10',
            'border-purple-500/50 hover:bg-purple-500/10',
            'border-indigo-500/50 hover:bg-indigo-500/10',
            'border-blue-500/50 hover:bg-blue-500/10',
        ];

        return (
            <div className={`ml-${level * 4} mt-2`}>
                <div
                    className={`
                        flex items-center gap-2 p-2 rounded-lg border bg-main/50 cursor-pointer transition-colors
                        ${colors[level % colors.length]}
                    `}
                    onClick={() => canExpand && toggleNode(uniqueKey)}
                >
                    <span className="text-secondary font-mono text-xs w-4">
                        {canExpand ? (isExpanded ? '[-]' : '[+]') : '•'}
                    </span>
                    <span className="text-primary font-mono break-all text-sm">
                        {address}/{cidr}
                    </span>
                    {canExpand && !isExpanded && (
                        <span className="text-xs text-muted ml-auto">
                            Click to carve
                        </span>
                    )}
                </div>
                {isExpanded && (
                    <div className="pl-4 border-l border-element ml-3">
                        {children.length > 0 ? (
                            children.map(child => (
                                <TreeNode
                                    key={child.key}
                                    address={child.address}
                                    cidr={child.netmask}
                                    level={level + 1}
                                />
                            ))
                        ) : (
                            <div className="p-2 text-muted text-xs italic">
                                Too many subnets to display or end of chain.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="glass-card rounded-2xl p-6 shadow-xl overflow-hidden">
            <h2 className="text-xl font-bold mb-6 text-primary flex items-center gap-3">
                <span className="w-1 h-6 accent-bar-green rounded-full"></span>
                <span className="text-accent-green">Subnet Tree Planner</span>
            </h2>

            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {rootCidr > 56 ? (
                    <div className="text-muted italic text-center p-4">
                        Select a prefix smaller than /64 (e.g. /48, /56) to plan subnets.
                    </div>
                ) : (
                    <TreeNode address={rootAddress} cidr={rootCidr} />
                )}
            </div>
        </div>
    );
}
