'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

interface HoldingItem {
  symbol: string;
  name: string;
  quantity: number;
  simulatedValueSru: number;
  type: string;
}

const ASSET_COLORS: Record<string, string> = {
  BTC: '#f59e0b',
  ETH: '#06b6d4',
  SOL: '#a855f7',
  TCS: '#3b82f6',
  RELIANCE: '#ec4899',
  INFY: '#10b981',
  BNB: '#eab308',
  XRP: '#6366f1',
  ADA: '#14b8a6',
  USDT: '#22c55e',
  DEFAULT: '#38bdf8',
};

function OrbScene({
  holdings,
  onSelectAsset,
}: {
  holdings: HoldingItem[];
  onSelectAsset: (asset: HoldingItem | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const totalValue = useMemo(
    () => holdings.reduce((sum, h) => sum + h.simulatedValueSru, 0) || 1,
    [holdings]
  );

  return (
    <group ref={groupRef}>

      <Sphere args={[0.9, 32, 32]}>
        <meshStandardMaterial
          color="#0f172a"
          emissive="#1e293b"
          roughness={0.3}
          metalness={0.9}
        />
      </Sphere>

      {holdings.map((h, i) => {
        const angle = (i / Math.max(1, holdings.length)) * Math.PI * 2;
        const radius = 2.4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 1.5) * 0.6;

        const proportion = h.simulatedValueSru / totalValue;
        const size = Math.max(0.25, Math.min(0.65, 0.25 + proportion * 0.8));
        const color = ASSET_COLORS[h.symbol] || ASSET_COLORS.DEFAULT;

        return (
          <Float key={h.symbol} speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
            <group position={[x, y, z]}>
              <Sphere
                args={[size, 24, 24]}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  onSelectAsset(h);
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  onSelectAsset(null);
                }}
              >
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.6}
                  metalness={0.8}
                  roughness={0.2}
                />
              </Sphere>
              <Text position={[0, -size - 0.2, 0]} fontSize={0.2} color="#f8fafc" anchorX="center" anchorY="top">
                {h.symbol}
              </Text>
            </group>
          </Float>
        );
      })}
    </group>
  );
}

export default function PortfolioOrbCanvas({ holdings }: { holdings: HoldingItem[] }) {
  const [hovered, setHovered] = useState<HoldingItem | null>(null);

  if (!holdings || holdings.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No asset holdings to visualize.
      </div>
    );
  }

  return (
    <div className="w-full h-80 relative rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800/80">
      <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -2]} intensity={0.8} color="#38bdf8" />
        <OrbScene holdings={holdings} onSelectAsset={setHovered} />
      </Canvas>

      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
        {hovered ? (
          <div>
            <span className="font-semibold text-cyan-400">{hovered.name} ({hovered.symbol})</span>
            <div className="text-slate-300">
              {hovered.quantity} units · <span className="text-emerald-400 font-mono">{hovered.simulatedValueSru.toLocaleString()} SRU</span>
            </div>
          </div>
        ) : (
          <span className="text-slate-400">Hover an asset node to inspect allocation</span>
        )}
      </div>
    </div>
  );
}
