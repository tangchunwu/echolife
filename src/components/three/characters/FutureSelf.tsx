import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FutureSelfProps {
  position: [number, number, number];
}

export function FutureSelfCharacter({ position }: FutureSelfProps) {
  const groupRef = useRef<THREE.Group>(null);
  const edgeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.12;
    }
    if (edgeRef.current) {
      const mat = edgeRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(t * 2.5) * 0.25;
      mat.opacity = 0.15 + Math.sin(t * 1.8) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color="#0e7490"
          roughness={0.3}
          metalness={0.6}
          emissive="#06b6d4"
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.22, 0.65, 8, 16]} />
        <meshStandardMaterial
          color="#164e63"
          roughness={0.2}
          metalness={0.7}
          emissive="#06b6d4"
          emissiveIntensity={0.15}
        />
      </mesh>

      <mesh position={[-0.38, 0.9, 0]}>
        <capsuleGeometry args={[0.08, 0.45, 4, 8]} />
        <meshStandardMaterial color="#0e7490" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.38, 0.9, 0]}>
        <capsuleGeometry args={[0.08, 0.45, 4, 8]} />
        <meshStandardMaterial color="#0e7490" roughness={0.3} metalness={0.5} />
      </mesh>

      <mesh position={[-0.12, 0.2, 0]}>
        <capsuleGeometry args={[0.1, 0.45, 4, 8]} />
        <meshStandardMaterial color="#155e75" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.12, 0.2, 0]}>
        <capsuleGeometry args={[0.1, 0.45, 4, 8]} />
        <meshStandardMaterial color="#155e75" roughness={0.3} metalness={0.5} />
      </mesh>

      <mesh ref={edgeRef} position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.85, 16, 16]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.5}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI * 2) / 4;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.6, 0.9, Math.sin(angle) * 0.6]}
          >
            <boxGeometry args={[0.02, 0.5, 0.02]} />
            <meshStandardMaterial
              color="#22d3ee"
              emissive="#22d3ee"
              emissiveIntensity={1}
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}

      <pointLight position={[0, 1, 0]} intensity={0.6} color="#06b6d4" distance={6} decay={2} />
    </group>
  );
}
