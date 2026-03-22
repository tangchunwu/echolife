import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../../store/gameStore';
import { audioManager } from '../../../systems/AudioManager';

interface ReturnPortalProps {
  position: [number, number, number];
}

export function ReturnPortal({ position }: ReturnPortalProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const setScene = useGameStore((s) => s.setScene);
  const setTransitioning = useGameStore((s) => s.setTransitioning);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      const mat = ringRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  const handleClick = () => {
    audioManager.playSfx('portal_enter');
    setTransitioning(true);
    setTimeout(() => {
      setScene('hall');
      setTransitioning(false);
    }, 1000);
  };

  return (
    <group
      position={position}
      onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; audioManager.playSfx('ui_hover'); }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    >
      <mesh ref={ringRef}>
        <torusGeometry args={[0.8, 0.06, 16, 64]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <mesh>
        <circleGeometry args={[0.75, 64]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <Text
        position={[0, 1.2, 0]}
        fontSize={0.2}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {'返回大厅'}
      </Text>
    </group>
  );
}
