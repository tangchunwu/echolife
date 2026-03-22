import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Portal } from '../objects/Portal';
import { Hourglass } from '../objects/Hourglass';
import { useGameStore } from '../../../store/gameStore';

function EnergyMotes() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#22d3ee'),
      new THREE.Color('#f59e0b'),
      new THREE.Color('#06b6d4'),
      new THREE.Color('#f43f5e'),
    ];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 6;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = 0.5 + Math.random() * 4;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3 + 1] += Math.sin(t * 0.5 + i * 0.1) * 0.002;
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = 0.5;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export function HallScene() {
  const platformRef = useRef<THREE.Mesh>(null);
  const pillarRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const unlockedTimelines = useGameStore((s) => s.unlockedTimelines);

  const platformGeometry = useMemo(() => new THREE.CylinderGeometry(8, 8, 0.5, 64), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (platformRef.current) {
      platformRef.current.rotation.y += delta * 0.02;
    }
    if (pillarRef.current) {
      const mat = pillarRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.06 + Math.sin(t * 1.5) * 0.03;
    }
    if (innerRingRef.current) {
      const mat = innerRingRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.15;
    }
  });

  const portalBases = useMemo(() => [
    { pos: [-5, -0.23, -3] as [number, number, number], color: '#f59e0b', scene: 'past' as const },
    { pos: [5, -0.23, -3] as [number, number, number], color: '#06b6d4', scene: 'future' as const },
    { pos: [0, -0.23, -6] as [number, number, number], color: '#f43f5e', scene: 'paradox' as const },
  ], []);

  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade speed={0.5} />

      <mesh ref={platformRef} position={[0, -0.5, 0]} geometry={platformGeometry}>
        <meshStandardMaterial
          color="#1a2332"
          metalness={0.8}
          roughness={0.2}
          emissive="#0d1520"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh position={[0, -0.24, 0]}>
        <ringGeometry args={[7.5, 8, 64]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={innerRingRef} position={[0, -0.23, 0]}>
        <ringGeometry args={[3, 3.2, 64]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.3}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={pillarRef} position={[0, 4, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 8, 16]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.6}
          transparent
          opacity={0.08}
        />
      </mesh>

      <EnergyMotes />

      {portalBases.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2, 32]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={unlockedTimelines.includes(p.scene) ? 0.4 : 0.08}
            transparent
            opacity={unlockedTimelines.includes(p.scene) ? 0.25 : 0.06}
          />
        </mesh>
      ))}

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Hourglass position={[0, 1.5, 0]} />
      </Float>

      <Portal
        position={[-5, 1.5, -3]}
        rotation={[0, Math.PI / 4, 0]}
        color1="#f59e0b"
        color2="#d97706"
        label="过去"
        targetScene="past"
        isUnlocked={unlockedTimelines.includes('past')}
      />
      <Portal
        position={[5, 1.5, -3]}
        rotation={[0, -Math.PI / 4, 0]}
        color1="#06b6d4"
        color2="#0891b2"
        label="未来"
        targetScene="future"
        isUnlocked={unlockedTimelines.includes('future')}
      />
      <Portal
        position={[0, 1.5, -6]}
        rotation={[0, 0, 0]}
        color1="#f43f5e"
        color2="#e11d48"
        label="悖论"
        targetScene="paradox"
        isUnlocked={unlockedTimelines.includes('paradox')}
      />

      <ambientLight intensity={0.35} />
      <pointLight position={[0, 6, 0]} intensity={2} color="#22d3ee" distance={30} decay={2} />
      <pointLight position={[-5, 4, -3]} intensity={1.2} color="#f59e0b" distance={20} decay={2} />
      <pointLight position={[5, 4, -3]} intensity={1.2} color="#06b6d4" distance={20} decay={2} />
      <pointLight position={[0, 4, -6]} intensity={0.8} color="#f43f5e" distance={20} decay={2} />
      <pointLight position={[0, -1, 4]} intensity={0.6} color="#e2e8f0" distance={15} decay={2} />
      <spotLight
        position={[0, 8, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#22d3ee"
        distance={20}
        decay={2}
      />

      <fog attach="fog" args={['#050a15', 25, 80]} />
    </group>
  );
}
