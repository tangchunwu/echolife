import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PastSelfProps {
  position: [number, number, number];
}

export function PastSelfCharacter({ position }: PastSelfProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.1;
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#fde68a" roughness={0.6} metalness={0.2} />
      </mesh>

      <mesh position={[0, 0.85, 0]}>
        <capsuleGeometry args={[0.2, 0.6, 8, 16]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.5} metalness={0.1} />
      </mesh>

      <mesh position={[-0.35, 0.85, 0]}>
        <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.6} />
      </mesh>
      <mesh position={[0.35, 0.85, 0]}>
        <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.6} />
      </mesh>

      <mesh position={[-0.12, 0.2, 0]}>
        <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
        <meshStandardMaterial color="#d97706" roughness={0.6} />
      </mesh>
      <mesh position={[0.12, 0.2, 0]}>
        <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
        <meshStandardMaterial color="#d97706" roughness={0.6} />
      </mesh>

      <mesh ref={glowRef} position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.3}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      <pointLight position={[0, 1, 0]} intensity={0.5} color="#f59e0b" distance={5} decay={2} />
    </group>
  );
}
