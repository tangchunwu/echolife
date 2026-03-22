import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../../store/gameStore';
import { ITEMS } from '../../../data/items';
import { audioManager } from '../../../systems/AudioManager';

interface MemoryFragmentProps {
  position: [number, number, number];
  color: string;
  itemId: string;
}

export function MemoryFragment({ position, color, itemId }: MemoryFragmentProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const [collecting, setCollecting] = useState(false);
  const collectProgress = useRef(0);
  const hasItem = useGameStore((s) => s.hasItem);
  const addItem = useGameStore((s) => s.addItem);
  const [hovered, setHovered] = useState(false);

  const collected = hasItem(itemId);

  useFrame((state, delta) => {
    if (collected) return;

    const t = state.clock.elapsedTime;

    if (collecting) {
      collectProgress.current += delta * 2.5;
      if (groupRef.current) {
        const s = Math.max(1 - collectProgress.current, 0);
        groupRef.current.scale.setScalar(s);
        groupRef.current.position.y = position[1] + collectProgress.current * 2;
        groupRef.current.rotation.y += delta * 12;
      }
      if (collectProgress.current >= 1) {
        const item = ITEMS[itemId];
        if (item) addItem(item);
      }
      return;
    }

    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.5;
      meshRef.current.rotation.y = t * 0.7;
      const s = hovered ? 1.3 : 1;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, s, 0.1));
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.3;
      innerRef.current.rotation.z = t * 0.4;
      const mat = innerRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = hovered
        ? 1.2 + Math.sin(t * 5) * 0.3
        : 0.5 + Math.sin(t * 3) * 0.3;
    }
  });

  if (collected) return null;

  const handleClick = () => {
    if (collecting) return;
    audioManager.playSfx('collect');
    setCollecting(true);
    collectProgress.current = 0;
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>

      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.13, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>

      <pointLight
        position={[0, 0, 0]}
        intensity={hovered ? 0.8 : 0.3}
        color={color}
        distance={hovered ? 5 : 3}
        decay={2}
      />
    </group>
  );
}
