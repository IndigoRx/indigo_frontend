"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  Float,
  OrbitControls,
  Sparkles,
  Stars,
} from "@react-three/drei";

function Globe() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1}>
      <group ref={groupRef}>
        {/* Inner glowing core */}
        <mesh>
          <sphereGeometry args={[1.25, 64, 64]} />
          <meshStandardMaterial
            color="#166534"
            emissive="#22c55e"
            emissiveIntensity={0.4}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>

        {/* Wireframe globe (lat/long grid) */}
        <mesh>
          <sphereGeometry args={[1.32, 32, 24]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Outer glow shell */}
        <mesh>
          <sphereGeometry args={[1.45, 32, 32]} />
          <meshBasicMaterial
            color="#a7f3d0"
            transparent
            opacity={0.08}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Capsule({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={2.5}>
      <mesh position={position} scale={scale} rotation={[0, 0, Math.PI / 4]}>
        <capsuleGeometry args={[0.16, 0.45, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
    </Float>
  );
}

export default function AboutScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <pointLight position={[-4, -2, -3]} intensity={0.6} color="#ffffff" />

      <Suspense fallback={null}>
        <Stars
          radius={20}
          depth={30}
          count={800}
          factor={2}
          saturation={0}
          fade
          speed={0.5}
        />

        <Globe />

        <Capsule position={[-2, 1.1, 0.6]} color="#ffffff" scale={0.8} />
        <Capsule position={[2.1, -0.9, 0.9]} color="#d1fae5" scale={1} />
        <Capsule position={[1.6, 1.4, -0.6]} color="#a7f3d0" scale={0.6} />

        <Sparkles count={40} scale={6} size={2} speed={0.4} color="#ffffff" />
      </Suspense>

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
    </Canvas>
  );
}
