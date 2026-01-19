import React, { useState } from 'react';
import { SimpleModeCard } from './SimpleModeCard';

// IPv6 Header field definitions with their bit sizes and colors
const HEADER_FIELDS = [
    { id: 'header_version', name: 'Version', bits: 4, color: 'purple', row: 1 },
    { id: 'header_traffic_class', name: 'Traffic Class', bits: 8, color: 'cyan', row: 1 },
    { id: 'header_flow_label', name: 'Flow Label', bits: 20, color: 'orange', row: 1 },
    { id: 'header_payload_length', name: 'Payload Length', bits: 16, color: 'pink', row: 2 },
    { id: 'header_next_header', name: 'Next Header', bits: 8, color: 'green', row: 2 },
    { id: 'header_hop_limit', name: 'Hop Limit', bits: 8, color: 'blue', row: 2 },
    { id: 'header_source_address', name: 'Source Address', bits: 128, color: 'purple', row: 3 },
    { id: 'header_destination_address', name: 'Destination Address', bits: 128, color: 'cyan', row: 4 },
];

// Color classes for fields
const colorClasses = {
    purple: {
        bg: 'bg-purple-500/20 hover:bg-purple-500/30',
        border: 'border-purple-500/40 hover:border-purple-500/60',
        text: 'text-purple-300',
        glow: 'hover:shadow-purple-500/20',
        activeBg: 'bg-purple-500/40',
        activeBorder: 'border-purple-400',
    },
    cyan: {
        bg: 'bg-cyan-500/20 hover:bg-cyan-500/30',
        border: 'border-cyan-500/40 hover:border-cyan-500/60',
        text: 'text-cyan-300',
        glow: 'hover:shadow-cyan-500/20',
        activeBg: 'bg-cyan-500/40',
        activeBorder: 'border-cyan-400',
    },
    orange: {
        bg: 'bg-orange-500/20 hover:bg-orange-500/30',
        border: 'border-orange-500/40 hover:border-orange-500/60',
        text: 'text-orange-300',
        glow: 'hover:shadow-orange-500/20',
        activeBg: 'bg-orange-500/40',
        activeBorder: 'border-orange-400',
    },
    pink: {
        bg: 'bg-pink-500/20 hover:bg-pink-500/30',
        border: 'border-pink-500/40 hover:border-pink-500/60',
        text: 'text-pink-300',
        glow: 'hover:shadow-pink-500/20',
        activeBg: 'bg-pink-500/40',
        activeBorder: 'border-pink-400',
    },
    green: {
        bg: 'bg-green-500/20 hover:bg-green-500/30',
        border: 'border-green-500/40 hover:border-green-500/60',
        text: 'text-green-300',
        glow: 'hover:shadow-green-500/20',
        activeBg: 'bg-green-500/40',
        activeBorder: 'border-green-400',
    },
    blue: {
        bg: 'bg-blue-500/20 hover:bg-blue-500/30',
        border: 'border-blue-500/40 hover:border-blue-500/60',
        text: 'text-blue-300',
        glow: 'hover:shadow-blue-500/20',
        activeBg: 'bg-blue-500/40',
        activeBorder: 'border-blue-400',
    },
};

export function IPv6HeaderVisualizer({ simpleData }) {
    const [selectedField, setSelectedField] = useState(null);

    const handleFieldClick = (fieldId) => {
        setSelectedField(selectedField === fieldId ? null : fieldId);
    };

    // Group fields by row
    const row1 = HEADER_FIELDS.filter(f => f.row === 1);
    const row2 = HEADER_FIELDS.filter(f => f.row === 2);
    const row3 = HEADER_FIELDS.filter(f => f.row === 3);
    const row4 = HEADER_FIELDS.filter(f => f.row === 4);

    const renderField = (field) => {
        const colors = colorClasses[field.color];
        const isSelected = selectedField === field.id;
        const widthPercent = (field.bits / 32) * 100;

        return (
            <button
                key={field.id}
                onClick={() => handleFieldClick(field.id)}
                style={{ width: field.bits >= 128 ? '100%' : `${widthPercent}%` }}
                className={`
                    relative p-3 md:p-4 rounded-lg border transition-all duration-300 cursor-pointer
                    ${isSelected ? colors.activeBg : colors.bg}
                    ${isSelected ? colors.activeBorder : colors.border}
                    ${colors.glow}
                    hover:shadow-lg hover:-translate-y-0.5
                    focus:outline-none focus:ring-2 focus:ring-accent/50
                `}
            >
                <div className={`text-xs md:text-sm font-semibold ${colors.text}`}>
                    {field.name}
                </div>
                <div className="text-xs text-muted mt-1">
                    {field.bits} bits
                </div>
                {isSelected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent animate-pulse" />
                )}
            </button>
        );
    };

    const renderAddressField = (field) => {
        const colors = colorClasses[field.color];
        const isSelected = selectedField === field.id;

        return (
            <button
                key={field.id}
                onClick={() => handleFieldClick(field.id)}
                className={`
                    w-full p-4 rounded-lg border transition-all duration-300 cursor-pointer
                    ${isSelected ? colors.activeBg : colors.bg}
                    ${isSelected ? colors.activeBorder : colors.border}
                    ${colors.glow}
                    hover:shadow-lg hover:-translate-y-0.5
                    focus:outline-none focus:ring-2 focus:ring-accent/50
                `}
            >
                <div className="flex items-center justify-between">
                    <div className={`text-sm md:text-base font-semibold ${colors.text}`}>
                        {field.name}
                    </div>
                    <div className="text-xs text-muted">
                        {field.bits} bits (16 bytes)
                    </div>
                </div>
                {isSelected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent animate-pulse" />
                )}
            </button>
        );
    };

    return (
        <div className="glass-card rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-2 text-primary flex items-center gap-3">
                <span className="w-1 h-6 accent-bar-orange rounded-full"></span>
                <span className="text-accent-orange">IPv6 Header Visualizer</span>
            </h2>
            <p className="text-sm text-muted mb-6">
                Click any field to learn what it does. The IPv6 header is exactly 40 bytes (320 bits).
            </p>

            {/* Header visualization */}
            <div className="space-y-2 mb-4">
                {/* Bit ruler */}
                <div className="flex justify-between text-xs text-muted font-mono px-1">
                    <span>0</span>
                    <span>8</span>
                    <span>16</span>
                    <span>24</span>
                    <span>31</span>
                </div>

                {/* Row 1: Version + Traffic Class + Flow Label */}
                <div className="flex gap-1.5">
                    {row1.map(renderField)}
                </div>

                {/* Row 2: Payload Length + Next Header + Hop Limit */}
                <div className="flex gap-1.5">
                    {row2.map(renderField)}
                </div>

                {/* Row 3: Source Address (spans 4 rows visually, but we show as one block) */}
                <div className="relative">
                    {row3.map(renderAddressField)}
                </div>

                {/* Row 4: Destination Address */}
                <div className="relative">
                    {row4.map(renderAddressField)}
                </div>
            </div>

            {/* Total size indicator */}
            <div className="flex items-center justify-between text-xs text-muted border-t border-border pt-3 mt-4">
                <span>Total Header Size</span>
                <span className="font-mono font-semibold text-secondary">40 bytes (320 bits)</span>
            </div>

            {/* Selected field explanation */}
            {selectedField && simpleData && simpleData[selectedField] && (
                <div className="mt-4 animate-fade-in">
                    <SimpleModeCard content={simpleData[selectedField]} />
                </div>
            )}

            {/* Hint when nothing selected */}
            {!selectedField && (
                <div className="mt-4 text-center text-sm text-muted py-4 border border-dashed border-border rounded-xl">
                    👆 Click any header field above to see an explanation
                </div>
            )}
        </div>
    );
}
