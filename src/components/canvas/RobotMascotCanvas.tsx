'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Torus, Float, Cone } from '@react-three/drei';
import * as THREE from 'three';

function RobotModel({ isHovered, isDancing = true }: { isHovered: boolean; isDancing?: boolean }) {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const thrusterRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (rootRef.current) {
      if (isDancing) {
        rootRef.current.position.y = Math.sin(t * 3.5) * 0.15;
        rootRef.current.position.x = Math.sin(t * 1.5) * 0.08;
        rootRef.current.rotation.z = Math.sin(t * 2.5) * 0.08;
      } else {
        rootRef.current.position.y = Math.sin(t * 2) * 0.06;
      }

      if (isHovered) {
        rootRef.current.rotation.y += delta * 2.5;
      } else {
        rootRef.current.rotation.y = Math.sin(t * 1.2) * 0.25;
      }
    }

    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 3) * 0.12;
      headRef.current.rotation.x = Math.cos(t * 2.5) * 0.08;
    }

    if (leftHandRef.current && rightHandRef.current) {
      leftHandRef.current.position.y = -0.3 + Math.sin(t * 4) * 0.12;
      leftHandRef.current.rotation.z = Math.sin(t * 4) * 0.4;
      
      rightHandRef.current.position.y = -0.3 + Math.cos(t * 4) * 0.12;
      rightHandRef.current.rotation.z = -Math.cos(t * 4) * 0.4;
    }

    if (thrusterRef.current) {
      thrusterRef.current.intensity = 1.5 + Math.sin(t * 12) * 0.8;
    }

    if (eyeLeftRef.current && eyeRightRef.current) {
      const blink = Math.sin(t * 0.8) > 0.95 ? 0.1 : 1;
      eyeLeftRef.current.scale.y = blink;
      eyeRightRef.current.scale.y = blink;
    }
  });

  const blueMaterial = new THREE.MeshStandardMaterial({
    color: '#1d4ed8',
    emissive: '#1e3a8a',
    emissiveIntensity: 0.35,
    roughness: 0.2,
    metalness: 0.85,
  });

  const cyanGlowMaterial = new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    emissive: '#00e5ff',
    emissiveIntensity: 1.4,
    roughness: 0.1,
  });

  const darkVisorMaterial = new THREE.MeshStandardMaterial({
    color: '#030712',
    roughness: 0.1,
    metalness: 0.9,
  });

  return (
    <group ref={rootRef}>
      <group ref={headRef} position={[0, 0.45, 0]}>
        <Sphere args={[0.48, 32, 32]}>
          <primitive object={blueMaterial} attach="material" />
        </Sphere>

        <mesh position={[0, 0.02, 0.32]}>
          <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <primitive object={darkVisorMaterial} attach="material" />
        </mesh>

        <mesh ref={eyeLeftRef} position={[-0.13, 0.08, 0.44]}>
          <boxGeometry args={[0.1, 0.06, 0.04]} />
          <primitive object={cyanGlowMaterial} attach="material" />
        </mesh>
        <mesh ref={eyeRightRef} position={[0.13, 0.08, 0.44]}>
          <boxGeometry args={[0.1, 0.06, 0.04]} />
          <primitive object={cyanGlowMaterial} attach="material" />
        </mesh>

        <group position={[-0.48, 0.05, 0]}>
          <Cylinder args={[0.18, 0.18, 0.1, 24]} rotation={[0, 0, Math.PI / 2]}>
            <primitive object={blueMaterial} attach="material" />
          </Cylinder>
          <Torus args={[0.16, 0.03, 16, 32]} rotation={[0, Math.PI / 2, 0]}>
            <primitive object={cyanGlowMaterial} attach="material" />
          </Torus>
        </group>
        <group position={[0.48, 0.05, 0]}>
          <Cylinder args={[0.18, 0.18, 0.1, 24]} rotation={[0, 0, Math.PI / 2]}>
            <primitive object={blueMaterial} attach="material" />
          </Cylinder>
          <Torus args={[0.16, 0.03, 16, 32]} rotation={[0, Math.PI / 2, 0]}>
            <primitive object={cyanGlowMaterial} attach="material" />
          </Torus>
        </group>

        <Cylinder args={[0.02, 0.02, 0.22, 12]} position={[0, 0.55, 0]}>
          <primitive object={blueMaterial} attach="material" />
        </Cylinder>
        <Sphere args={[0.06, 16, 16]} position={[0, 0.68, 0]}>
          <primitive object={cyanGlowMaterial} attach="material" />
        </Sphere>
      </group>

      <group ref={bodyRef} position={[0, -0.22, 0]}>
        <Sphere args={[0.34, 32, 24]} scale={[1, 1.15, 0.9]}>
          <primitive object={blueMaterial} attach="material" />
        </Sphere>

        <Sphere args={[0.1, 16, 16]} position={[0, 0.08, 0.28]}>
          <primitive object={cyanGlowMaterial} attach="material" />
        </Sphere>
        <Torus args={[0.12, 0.02, 16, 32]} position={[0, 0.08, 0.26]}>
          <primitive object={darkVisorMaterial} attach="material" />
        </Torus>

        <Cone args={[0.14, 0.22, 16]} position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
          <primitive object={darkVisorMaterial} attach="material" />
        </Cone>
        <Sphere args={[0.09, 16, 16]} position={[0, -0.48, 0]}>
          <meshBasicMaterial color="#38bdf8" />
        </Sphere>
        <pointLight ref={thrusterRef} position={[0, -0.5, 0]} color="#00e5ff" intensity={2} distance={1.8} />
      </group>

      <group ref={leftHandRef} position={[-0.45, -0.3, 0.1]}>
        <Sphere args={[0.1, 16, 16]}>
          <primitive object={blueMaterial} attach="material" />
        </Sphere>
        <Torus args={[0.09, 0.02, 12, 24]}>
          <primitive object={cyanGlowMaterial} attach="material" />
        </Torus>
      </group>

      <group ref={rightHandRef} position={[0.45, -0.3, 0.1]}>
        <Sphere args={[0.1, 16, 16]}>
          <primitive object={blueMaterial} attach="material" />
        </Sphere>
        <Torus args={[0.09, 0.02, 12, 24]}>
          <primitive object={cyanGlowMaterial} attach="material" />
        </Torus>
      </group>
    </group>
  );
}

export default function RobotMascotCanvas({
  onClick,
  isDancing = true,
}: {
  onClick?: () => void;
  isDancing?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-28 h-36 cursor-pointer relative transition-transform hover:scale-105 active:scale-95"
      title="Chat with ByteBank AI Assistant"
    >
      <Canvas
        camera={{ position: [0, 0.1, 2.4], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 5, 4]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-4, 2, -2]} intensity={0.8} color="#0284c7" />
        <pointLight position={[0, 0, 2]} intensity={0.6} color="#38bdf8" />
        <RobotModel isHovered={hovered} isDancing={isDancing} />
      </Canvas>
    </div>
  );
}

