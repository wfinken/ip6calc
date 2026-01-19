import React, { useLayoutEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Html } from '@react-three/drei';
import * as THREE from 'three';

// Helper to read CSS variables
const getThemeColors = () => {
    if (typeof window === 'undefined') return {
        network: new THREE.Color('#818cf8'),
        host: new THREE.Color('#94a3b8'),
        highlight: new THREE.Color('#fbbf24')
    };

    const style = getComputedStyle(document.documentElement);
    const accent = style.getPropertyValue('--accent-color').trim() || '#818cf8';
    const muted = style.getPropertyValue('--text-muted').trim() || '#94a3b8';
    // const primary = style.getPropertyValue('--text-primary').trim() || '#ffffff';

    return {
        network: new THREE.Color(accent),
        host: new THREE.Color(muted),
        highlight: new THREE.Color('#fbbf24') // Keep amber for highlights or derive? Keeping yellow for visibility.
    };
};

function VoxelGrid({ ipv6, cidr, layout, showHighlights, themeColors }) {
    const meshRef = useRef();
    const count = 128;
    const tempObject = useMemo(() => new THREE.Object3D(), []);
    const tempColor = useMemo(() => new THREE.Color(), []);

    // Compute positions based on layout
    const positions = useMemo(() => {
        const pos = [];

        if (layout === 'matrix') {
            const rowSize = 16;
            for (let i = 0; i < count; i++) {
                const row = Math.floor(i / rowSize);
                const col = i % rowSize;
                pos.push({
                    x: (col - 7.5) * 1.2,
                    y: (3.5 - row) * 1.2,
                    z: 0
                });
            }
        } else if (layout === 'segments') {
            for (let i = 0; i < count; i++) {
                const groupIndex = Math.floor(i / 16);
                const bitInGroup = i % 16;

                const groupRow = Math.floor(bitInGroup / 4);
                const groupCol = bitInGroup % 4;

                const groupX = (groupIndex - 3.5) * 6;

                const x = groupX + (groupCol - 1.5) * 1.0;
                const y = (1.5 - groupRow) * 1.0;

                pos.push({ x, y, z: 0 });
            }
        }

        return pos;
    }, [layout]);

    useLayoutEffect(() => {
        if (!meshRef.current) return;

        // Use current theme colors
        const { network, host, highlight } = themeColors;
        const binaryString = ipv6?.binary || '';

        for (let i = 0; i < count; i++) {
            const { x, y, z } = positions[i];

            tempObject.position.set(x, y, z);
            tempObject.scale.set(1, 1, 1);
            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObject.matrix);

            // Color logic
            const isNetwork = i < cidr;
            const isOne = binaryString[i] === '1';

            if (showHighlights && isOne) {
                tempColor.copy(highlight);
            } else if (isNetwork) {
                tempColor.copy(network);
                if (isOne && !showHighlights) tempColor.offsetHSL(0, 0, 0.2);
            } else {
                tempColor.copy(host);
                if (isOne && !showHighlights) tempColor.offsetHSL(0, 0, 0.1);
            }

            meshRef.current.setColorAt(i, tempColor);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

    }, [ipv6, cidr, positions, showHighlights, themeColors]);

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <boxGeometry args={[0.9, 0.9, 0.9]} />
            <meshStandardMaterial
                roughness={0.2}
                metalness={0.2}
                emissive={themeColors.network}
                emissiveIntensity={0.2}
                toneMapped={false}
            />
        </instancedMesh>
    );
}

export function ThreeBitExplorer({ ipv6, cidr }) {
    const [layout, setLayout] = useState('matrix'); // 'matrix' | 'segments'
    const [showHighlights, setShowHighlights] = useState(false);
    const [themeColors, setThemeColors] = useState(() => getThemeColors());

    // Listen for theme changes
    React.useEffect(() => {
        const updateColors = () => {
            setThemeColors(getThemeColors());
        };

        // Initial update in case it changed before mount
        updateColors();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    updateColors();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="h-96 w-full bg-card rounded-2xl overflow-hidden border border-element/50 shadow-inner relative group">
            {/* Header Label */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <h3 className="text-primary font-bold text-sm bg-main/50 px-3 py-1 rounded-full backdrop-blur border border-element/20">
                    Spatial Explorer
                </h3>
            </div>

            {/* Controls Overlay - Visible on hover/always */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-main/80 p-1.5 rounded-xl backdrop-blur border border-element/20 transition-opacity opacity-0 group-hover:opacity-100">
                <div className="flex bg-element rounded-lg p-0.5">
                    <button
                        onClick={() => setLayout('matrix')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${layout === 'matrix' ? 'bg-accent text-accent-text-contrast shadow' : 'text-muted hover:text-primary'}`}
                    >
                        Matrix
                    </button>
                    <button
                        onClick={() => setLayout('segments')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${layout === 'segments' ? 'bg-accent text-accent-text-contrast shadow' : 'text-muted hover:text-primary'}`}
                    >
                        Segments
                    </button>
                </div>
                <div className="w-px bg-element mx-1"></div>
                <button
                    onClick={() => setShowHighlights(!showHighlights)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${showHighlights ? 'bg-amber-500 text-amber-950 shadow' : 'bg-element text-muted hover:text-primary'}`}
                >
                    Highlight 1s
                </button>
            </div>

            <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={3.0} color={themeColors.network} />
                <pointLight position={[-10, 5, 20]} intensity={2.0} color="#ffffff" />

                <Center>
                    <VoxelGrid ipv6={ipv6} cidr={cidr} layout={layout} showHighlights={showHighlights} themeColors={themeColors} />
                </Center>

                <OrbitControls
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI * 3 / 4}
                    minDistance={10}
                    maxDistance={40}
                    autoRotate={false}
                // Disable autoRotate to make controls usage easier
                />
            </Canvas>
        </div>
    );
}
