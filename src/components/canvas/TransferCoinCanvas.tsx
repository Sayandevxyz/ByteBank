'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Text } from '@react-three/drei';
import * as THREE from 'three';

interface TransferCoinProps {
  status: 'idle' | 'pending' | 'success' | 'failed';
  senderAccountNo: string;
  receiverAccountNo: string;
  assetSymbol: string;
}

function TransferScene({ status, senderAccountNo, receiverAccountNo, assetSymbol }: TransferCoinProps) {
  const coinRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);

  useFrame((_, delta) => {
    if (coinRef.current) {
      if (status === 'pending') {
        progressRef.current = (progressRef.current + delta * 0.8) % 1;

        const t = progressRef.current;
        const x = THREE.MathUtils.lerp(-2.2, 2.2, t);
        const y = Math.sin(t * Math.PI) * 1.2;
        coinRef.current.position.set(x, y, 0);
        coinRef.current.rotation.y += delta * 5;
      } else if (status === 'success') {
        coinRef.current.position.set(2.2, 0, 0);
        coinRef.current.rotation.y += delta * 2;
      } else if (status === 'failed') {
        coinRef.current.position.set(0, -0.8, 0);
      } else {
        coinRef.current.position.set(-2.2, 0, 0);
      }
    }
  });

  const coinColor =
    status === 'success'
      ? '#10b981'
      : status === 'failed'
      ? '#ef4444'
      : status === 'pending'
      ? '#06b6d4'
      : '#f59e0b';

  return (
    <group>

      <group position={[-2.2, 0, 0]}>
        <Sphere args={[0.55, 32, 32]}>
          <meshStandardMaterial color="#0ea5e9" emissive="#0284c7" emissiveIntensity={0.8} />
        </Sphere>
        <Text position={[0, -0.8, 0]} fontSize={0.18} color="#94a3b8" anchorX="center">
          {senderAccountNo || 'Sender'}
        </Text>
      </group>

      <group position={[2.2, 0, 0]}>
        <Sphere args={[0.55, 32, 32]}>
          <meshStandardMaterial
            color={status === 'success' ? '#10b981' : '#6366f1'}
            emissive={status === 'success' ? '#059669' : '#4338ca'}
            emissiveIntensity={0.8}
          />
        </Sphere>
        <Text position={[0, -0.8, 0]} fontSize={0.18} color="#94a3b8" anchorX="center">
          {receiverAccountNo || 'Recipient'}
        </Text>
      </group>

      <mesh rotation={[0, 0, 0]}>
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(-2.2, 0, 0),
              new THREE.Vector3(0, 1.2, 0),
              new THREE.Vector3(2.2, 0, 0),
            ]),
            64,
            0.02,
            8,
            false,
          ]}
        />
        <meshStandardMaterial
          color={status === 'success' ? '#10b981' : '#38bdf8'}
          emissive={status === 'success' ? '#10b981' : '#0284c7'}
          emissiveIntensity={status === 'pending' ? 1.5 : 0.4}
        />
      </mesh>

      <group ref={coinRef} position={[-2.2, 0, 0]}>
        <Cylinder args={[0.3, 0.3, 0.08, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={coinColor} emissive={coinColor} emissiveIntensity={1} metalness={0.9} />
        </Cylinder>
        <Text position={[0, 0, 0.05]} fontSize={0.16} color="#ffffff" anchorX="center" anchorY="middle">
          {assetSymbol || 'COIN'}
        </Text>
      </group>
    </group>
  );
}

export default function TransferCoinCanvas(props: TransferCoinProps) {
  return (
    <div className="w-full h-48 relative rounded-xl bg-slate-950/60 border border-slate-800">
      <Canvas camera={{ position: [0, 0.4, 4.2], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[0, 5, 5]} intensity={1.5} />
        <TransferScene {...props} />
      </Canvas>
      <div className="absolute bottom-2 left-0 right-0 text-center text-xs font-mono">
        {props.status === 'pending' && <span className="text-cyan-400 animate-pulse">● Executing ACID Transfer Transaction...</span>}
        {props.status === 'success' && <span className="text-emerald-400 font-semibold">✓ Transfer Posted to Double-Entry Ledger</span>}
        {props.status === 'failed' && <span className="text-rose-400 font-semibold">✗ Transaction Rolled Back & Logged</span>}
        {props.status === 'idle' && <span className="text-slate-500">Ready for Transfer Preview</span>}
      </div>
    </div>
  );
}
