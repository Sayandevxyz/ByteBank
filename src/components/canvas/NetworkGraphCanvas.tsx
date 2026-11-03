'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

interface AccountNode {
  id: number;
  label: string;
  isSystem?: boolean;
  status?: string;
  position: [number, number, number];
}

interface TransferEdge {
  from: [number, number, number];
  to: [number, number, number];
  status: 'success' | 'failed' | 'flagged';
}

function GraphScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  const nodes: AccountNode[] = useMemo(() => [
    { id: 1, label: 'TREASURY', isSystem: true, position: [0, 1.2, 0] },
    { id: 2, label: 'MARKET_MAKER', isSystem: true, position: [0, -1.2, 0] },
    { id: 3, label: 'BB-ACC-5001', status: 'active', position: [-2.2, 0.6, 0.8] },
    { id: 4, label: 'BB-ACC-5002', status: 'active', position: [-1.4, -0.8, -1.2] },
    { id: 5, label: 'BB-ACC-5003', status: 'active', position: [2.0, 0.4, 0.6] },
    { id: 6, label: 'BB-ACC-5004', status: 'frozen', position: [1.6, -1.0, -1.0] },
    { id: 7, label: 'BB-ACC-5005', status: 'active', position: [-0.8, 1.8, -0.9] },
    { id: 8, label: 'BB-ACC-5006', status: 'active', position: [1.2, 1.6, 1.0] },
  ], []);

  const edges: TransferEdge[] = useMemo(() => [
    { from: nodes[0].position, to: nodes[2].position, status: 'success' },
    { from: nodes[2].position, to: nodes[4].position, status: 'success' },
    { from: nodes[2].position, to: nodes[3].position, status: 'success' },
    { from: nodes[2].position, to: nodes[6].position, status: 'success' },
    { from: nodes[3].position, to: nodes[4].position, status: 'success' },
    { from: nodes[3].position, to: nodes[6].position, status: 'failed' },
    { from: nodes[2].position, to: nodes[4].position, status: 'success' },
    { from: nodes[5].position, to: nodes[3].position, status: 'flagged' },
  ], [nodes]);

  return (
    <group ref={groupRef}>

      {edges.map((edge, idx) => {
        const color =
          edge.status === 'success'
            ? '#10b981'
            : edge.status === 'failed'
            ? '#ef4444'
            : '#f59e0b';
        return (
          <Line
            key={idx}
            points={[edge.from, edge.to]}
            color={color}
            lineWidth={edge.status === 'failed' ? 2 : 1}
            dashed={edge.status === 'failed'}
            dashScale={2}
          />
        );
      })}

      {nodes.map((node) => {
        const nodeColor = node.isSystem
          ? '#eab308'
          : node.status === 'frozen'
          ? '#ef4444'
          : '#0ea5e9';

        return (
          <group key={node.id} position={node.position}>
            <Sphere args={[node.isSystem ? 0.35 : 0.25, 24, 24]}>
              <meshStandardMaterial
                color={nodeColor}
                emissive={nodeColor}
                emissiveIntensity={0.8}
                metalness={0.9}
              />
            </Sphere>
            <Text position={[0, -0.4, 0]} fontSize={0.16} color="#e2e8f0" anchorX="center">
              {node.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export default function NetworkGraphCanvas() {
  return (
    <div className="w-full h-80 relative rounded-xl bg-slate-950/70 border border-slate-800">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -3]} intensity={1} color="#38bdf8" />
        <GraphScene />
      </Canvas>
      <div className="absolute bottom-2 left-3 flex gap-4 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Success</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" /> Insufficient/Rejected</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> System/Treasury</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400" /> Active Customer</span>
      </div>
    </div>
  );
}
