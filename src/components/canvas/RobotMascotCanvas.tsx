'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Torus, Cone } from '@react-three/drei';
import * as THREE from 'three';

function RobotModel({ isHovered, isDancing = true }: { isHovered: boolean; isDancing?: boolean }) {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const leftFlameRef = useRef<THREE.Mesh>(null);
  const rightFlameRef = useRef<THREE.Mesh>(null);
  const thrusterLightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (rootRef.current) {
      if (isDancing) {
        rootRef.current.position.y = Math.sin(t * 3.6) * 0.12;
        rootRef.current.position.x = Math.sin(t * 1.8) * 0.06;
        rootRef.current.rotation.z = Math.sin(t * 2.4) * 0.07;
      } else {
        rootRef.current.position.y = Math.sin(t * 2) * 0.05;
      }

      if (isHovered) {
        rootRef.current.rotation.y += delta * 3;
      } else {
        rootRef.current.rotation.y = Math.sin(t * 1.2) * 0.22;
      }
    }

    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 3.2) * 0.09;
      headRef.current.rotation.x = Math.cos(t * 2.2) * 0.06;
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.1;
    }

    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.position.y = -0.16 + Math.sin(t * 4.2) * 0.06;
      leftArmRef.current.rotation.z = -0.3 + Math.sin(t * 4.2) * 0.25;
      leftArmRef.current.rotation.x = Math.cos(t * 3.5) * 0.15;

      rightArmRef.current.position.y = -0.16 + Math.cos(t * 4.2) * 0.06;
      rightArmRef.current.rotation.z = 0.3 - Math.cos(t * 4.2) * 0.25;
      rightArmRef.current.rotation.x = -Math.cos(t * 3.5) * 0.15;
    }

    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = 0.1 + Math.sin(t * 3.6) * 0.15;
      rightLegRef.current.rotation.x = 0.1 - Math.sin(t * 3.6) * 0.15;
    }

    const flameScale = 1 + Math.sin(t * 18) * 0.35;
    if (leftFlameRef.current) {
      leftFlameRef.current.scale.y = flameScale;
    }
    if (rightFlameRef.current) {
      rightFlameRef.current.scale.y = flameScale;
    }

    if (thrusterLightRef.current) {
      thrusterLightRef.current.intensity = 2.2 + Math.sin(t * 14) * 0.8;
    }

    if (eyeLeftRef.current && eyeRightRef.current) {
      const isBlinking = t % 3.6 < 0.12;
      const blinkScale = isBlinking ? 0.08 : 1;
      eyeLeftRef.current.scale.y = blinkScale;
      eyeRightRef.current.scale.y = blinkScale;
    }
  });

  const blueMaterial = new THREE.MeshStandardMaterial({
    color: '#2563eb',
    emissive: '#1d4ed8',
    emissiveIntensity: 0.25,
    roughness: 0.22,
    metalness: 0.82,
  });

  const darkVisorMaterial = new THREE.MeshStandardMaterial({
    color: '#030712',
    roughness: 0.08,
    metalness: 0.95,
  });

  const cyanGlowMaterial = new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    emissive: '#00f5ff',
    emissiveIntensity: 1.8,
    roughness: 0.1,
  });

  const whiteEmblemMaterial = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    emissive: '#e0f2fe',
    emissiveIntensity: 0.8,
    roughness: 0.2,
  });

  const flameMaterial = new THREE.MeshBasicMaterial({
    color: '#00e5ff',
    transparent: true,
    opacity: 0.9,
  });

  return (
    <group ref={rootRef}>
      <group ref={headRef} position={[0, 0.44, 0]}>
        <Sphere args={[0.42, 32, 32]} scale={[1.05, 0.98, 1]}>
          <primitive object={blueMaterial} attach="material" />
        </Sphere>

        <mesh position={[0, -0.01, 0.22]} rotation={[Math.PI * 0.45, 0, 0]}>
          <sphereGeometry args={[0.32, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
          <primitive object={darkVisorMaterial} attach="material" />
        </mesh>

        <mesh ref={eyeLeftRef} position={[-0.12, 0.04, 0.43]}>
          <boxGeometry args={[0.1, 0.055, 0.02]} />
          <primitive object={cyanGlowMaterial} attach="material" />
        </mesh>
        <mesh ref={eyeRightRef} position={[0.12, 0.04, 0.43]}>
          <boxGeometry args={[0.1, 0.055, 0.02]} />
          <primitive object={cyanGlowMaterial} attach="material" />
        </mesh>

        <group position={[-0.44, 0.02, 0]}>
          <Cylinder args={[0.16, 0.16, 0.08, 24]} rotation={[0, 0, Math.PI / 2]}>
            <primitive object={blueMaterial} attach="material" />
          </Cylinder>
          <Torus args={[0.14, 0.025, 16, 32]} rotation={[0, Math.PI / 2, 0]}>
            <primitive object={cyanGlowMaterial} attach="material" />
          </Torus>
        </group>

        <group position={[0.44, 0.02, 0]}>
          <Cylinder args={[0.16, 0.16, 0.08, 24]} rotation={[0, 0, Math.PI / 2]}>
            <primitive object={blueMaterial} attach="material" />
          </Cylinder>
          <Torus args={[0.14, 0.025, 16, 32]} rotation={[0, Math.PI / 2, 0]}>
            <primitive object={cyanGlowMaterial} attach="material" />
          </Torus>
        </group>

        <Cylinder args={[0.018, 0.018, 0.16, 12]} position={[0, 0.48, 0]}>
          <primitive object={blueMaterial} attach="material" />
        </Cylinder>
        <Sphere args={[0.055, 16, 16]} position={[0, 0.58, 0]}>
          <primitive object={cyanGlowMaterial} attach="material" />
        </Sphere>
      </group>

      <group position={[0, -0.16, 0]}>
        <Torus args={[0.19, 0.03, 16, 32]} position={[0, 0.23, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <primitive object={darkVisorMaterial} attach="material" />
        </Torus>

        <Sphere args={[0.3, 32, 24]} scale={[1, 1.15, 0.95]}>
          <primitive object={blueMaterial} attach="material" />
        </Sphere>

        <mesh position={[0, 0.05, 0.27]}>
          <boxGeometry args={[0.12, 0.1, 0.02]} />
          <primitive object={whiteEmblemMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.05, 0.282]}>
          <boxGeometry args={[0.06, 0.05, 0.01]} />
          <primitive object={cyanGlowMaterial} attach="material" />
        </mesh>
      </group>

      <group ref={leftArmRef} position={[-0.34, -0.16, 0]}>
        <Sphere args={[0.08, 16, 16]}>
          <primitive object={blueMaterial} attach="material" />
        </Sphere>
        <Cylinder args={[0.05, 0.045, 0.18, 16]} position={[0, -0.12, 0.04]} rotation={[0.4, 0, -0.2]}>
          <primitive object={blueMaterial} attach="material" />
        </Cylinder>
        <Torus args={[0.052, 0.015, 12, 24]} position={[0.02, -0.2, 0.07]} rotation={[0.4, 0, 0]}>
          <primitive object={cyanGlowMaterial} attach="material" />
        </Torus>
        <Sphere args={[0.065, 16, 16]} position={[0.03, -0.24, 0.08]}>
          <primitive object={blueMaterial} attach="material" />
        </Sphere>
      </group>

      <group ref={rightArmRef} position={[0.34, -0.16, 0]}>
        <Sphere args={[0.08, 16, 16]}>
          <primitive object={blueMaterial} attach="material" />
        </Sphere>
        <Cylinder args={[0.05, 0.045, 0.18, 16]} position={[0, -0.12, 0.04]} rotation={[0.4, 0, 0.2]}>
          <primitive object={blueMaterial} attach="material" />
        </Cylinder>
        <Torus args={[0.052, 0.015, 12, 24]} position={[-0.02, -0.2, 0.07]} rotation={[0.4, 0, 0]}>
          <primitive object={cyanGlowMaterial} attach="material" />
        </Torus>
        <Sphere args={[0.065, 16, 16]} position={[-0.03, -0.24, 0.08]}>
          <primitive object={blueMaterial} attach="material" />
        </Sphere>
      </group>

      <group ref={leftLegRef} position={[-0.14, -0.44, 0]}>
        <Cylinder args={[0.055, 0.05, 0.16, 16]} position={[0, -0.06, 0]}>
          <primitive object={blueMaterial} attach="material" />
        </Cylinder>
        <Sphere args={[0.08, 16, 16]} position={[0, -0.16, 0.03]} scale={[1, 1.2, 1.4]}>
          <primitive object={blueMaterial} attach="material" />
        </Sphere>
        <Cylinder args={[0.05, 0.04, 0.06, 16]} position={[0, -0.24, 0]}>
          <primitive object={darkVisorMaterial} attach="material" />
        </Cylinder>
        <mesh ref={leftFlameRef} position={[0, -0.34, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.07, 0.2, 16]} />
          <primitive object={flameMaterial} attach="material" />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.14, -0.44, 0]}>
        <Cylinder args={[0.055, 0.05, 0.16, 16]} position={[0, -0.06, 0]}>
          <primitive object={blueMaterial} attach="material" />
        </Cylinder>
        <Sphere args={[0.08, 16, 16]} position={[0, -0.16, 0.03]} scale={[1, 1.2, 1.4]}>
          <primitive object={blueMaterial} attach="material" />
        </Sphere>
        <Cylinder args={[0.05, 0.04, 0.06, 16]} position={[0, -0.24, 0]}>
          <primitive object={darkVisorMaterial} attach="material" />
        </Cylinder>
        <mesh ref={rightFlameRef} position={[0, -0.34, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.07, 0.2, 16]} />
          <primitive object={flameMaterial} attach="material" />
        </mesh>
      </group>

      <pointLight ref={thrusterLightRef} position={[0, -0.72, 0]} color="#00f5ff" intensity={2.5} distance={2.2} />
    </group>
  );
}

export default function RobotMascotCanvas({
  onClick,
  isDancing = true,
  className,
}: {
  onClick?: () => void;
  isDancing?: boolean;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`cursor-pointer relative transition-transform hover:scale-105 active:scale-95 ${className || 'w-28 h-36'}`}
      title="ByteBank 3D Assistant"
    >
      <Canvas
        camera={{ position: [0, 0.05, 2.3], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 5, 4]} intensity={2.0} color="#ffffff" />
        <directionalLight position={[-4, 2, -2]} intensity={0.9} color="#0284c7" />
        <pointLight position={[0, 0.5, 2]} intensity={0.8} color="#38bdf8" />
        <RobotModel isHovered={hovered} isDancing={isDancing} />
      </Canvas>
    </div>
  );
}
