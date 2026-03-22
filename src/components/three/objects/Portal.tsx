import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { portalVertexShader, portalFragmentShader } from '../../../shaders/portalShader';
import { useGameStore } from '../../../store/gameStore';
import { audioManager } from '../../../systems/AudioManager';
import type { SceneId } from '../../../types/game';

interface PortalProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color1: string;
  color2: string;
  label: string;
  targetScene: SceneId;
  isUnlocked: boolean;
}

export function Portal({ position, rotation, color1, color2, label, targetScene, isUnlocked }: PortalProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  const setScene = useGameStore((s) => s.setScene);
  const setPhase = useGameStore((s) => s.setPhase);
  const setTransitioning = useGameStore((s) => s.setTransitioning);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(color1) },
    uColor2: { value: new THREE.Color(color2) },
  }), [color1, color2]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (frameRef.current) {
      const mat = frameRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = isUnlocked
        ? 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.15
        : 0.05;
    }
  });

  const handleClick = () => {
    if (!isUnlocked) return;
    audioManager.playSfx('portal_enter');
    setTransitioning(true);
    setTimeout(() => {
      setScene(targetScene);
      setPhase('playing');
      setTransitioning(false);
    }, 1000);
  };

  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer';
    audioManager.playSfx('ui_hover');
  };

  return (
    <group position={position} rotation={rotation ?? [0, 0, 0]}>
      <mesh ref={frameRef}>
        <torusGeometry args={[1.2, 0.08, 16, 64]} />
        <meshStandardMaterial
          color={isUnlocked ? color1 : '#333333'}
          emissive={isUnlocked ? color1 : '#111111'}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {isUnlocked && (
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
        >
          <circleGeometry args={[1.15, 64]} />
          <shaderMaterial
            vertexShader={portalVertexShader}
            fragmentShader={portalFragmentShader}
            uniforms={uniforms}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      <Text
        position={[0, 1.8, 0]}
        fontSize={0.3}
        color={isUnlocked ? color1 : '#555555'}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {label}
      </Text>

      {!isUnlocked && (
        <Text
          position={[0, -1.6, 0]}
          fontSize={0.15}
          color="#666666"
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          {'[需要钥匙]'}
        </Text>
      )}
    </group>
  );
}
