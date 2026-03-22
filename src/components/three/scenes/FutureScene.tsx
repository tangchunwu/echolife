import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { FutureSelfCharacter } from '../characters/FutureSelf';
import { MemoryFragment } from '../objects/MemoryFragment';
import { ReturnPortal } from '../objects/ReturnPortal';

function HologramPanel({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation ?? [0, 0, 0]}>
      <planeGeometry args={[2, 1.5]} />
      <meshStandardMaterial
        color="#06b6d4"
        emissive="#06b6d4"
        emissiveIntensity={0.5}
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function NeonLine({ points, color }: { points: THREE.Vector3[]; color: string }) {
  const obj = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.8 });
    return new THREE.Line(geometry, material);
  }, [points, color]);

  return <primitive object={obj} />;
}

function DataStreams() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = Math.random() * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3 + 1] += 0.015;
      if (pos[i * 3 + 1] > 6) pos[i * 3 + 1] = 0;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#22d3ee" size={0.03} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function ScanRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.elapsedTime;
    const scale = ((t * 0.3) % 1) * 8;
    ringRef.current.scale.set(scale, scale, 1);
    const mat = ringRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = Math.max(0.2 - (scale / 8) * 0.2, 0);
  });

  return (
    <mesh ref={ringRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.95, 1, 64]} />
      <meshStandardMaterial
        color="#06b6d4"
        emissive="#06b6d4"
        emissiveIntensity={0.8}
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function FutureScene() {
  const gridRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (gridRef.current) {
      const mat = gridRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const gridLines = useMemo(() => {
    const lines: { points: THREE.Vector3[]; color: string }[] = [];
    for (let i = -6; i <= 6; i += 2) {
      lines.push({
        points: [new THREE.Vector3(i, 0.01, -6), new THREE.Vector3(i, 0.01, 6)],
        color: '#0e7490',
      });
      lines.push({
        points: [new THREE.Vector3(-6, 0.01, i), new THREE.Vector3(6, 0.01, i)],
        color: '#0e7490',
      });
    }
    return lines;
  }, []);

  return (
    <group>
      <mesh ref={gridRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive="#06b6d4"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {gridLines.map((line, i) => (
        <NeonLine key={i} points={line.points} color={line.color} />
      ))}

      <ScanRing />
      <DataStreams />

      {[[-5, 0, -5], [5, 0, -5], [-5, 0, 5], [5, 0, 5]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 2.5, 0]}>
            <boxGeometry args={[0.15, 5, 0.15]} />
            <meshStandardMaterial
              color="#164e63"
              emissive="#06b6d4"
              emissiveIntensity={0.3}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0, 5, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#22d3ee"
              emissiveIntensity={1.5}
            />
          </mesh>
          <pointLight
            position={[0, 4.5, 0]}
            intensity={0.3}
            color="#06b6d4"
            distance={6}
            decay={2}
          />
        </group>
      ))}

      {[[-3, 2, -4.8], [3, 2.5, -4.8], [4.8, 2, -2], [4.8, 2.5, 2]].map((pos, i) => (
        <Float key={i} speed={1} floatIntensity={0.1}>
          <HologramPanel
            position={pos as [number, number, number]}
            rotation={[0, i >= 2 ? -Math.PI / 2 : 0, 0]}
          />
        </Float>
      ))}

      <mesh position={[0, 3.5, -5.5]}>
        <planeGeometry args={[8, 3]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#06b6d4"
          emissiveIntensity={0.15}
          transparent
          opacity={0.5}
        />
      </mesh>

      <Float speed={1.5} floatIntensity={0.3}>
        <FutureSelfCharacter position={[0, 0, -2]} />
      </Float>

      <Float speed={2} floatIntensity={0.5}>
        <MemoryFragment position={[-3, 1.5, 1]} color="#06b6d4" itemId="memory_fragment_3" />
      </Float>
      <Float speed={1.8} floatIntensity={0.4}>
        <MemoryFragment position={[3, 2, -1]} color="#22d3ee" itemId="hourglass_shard" />
      </Float>

      <ReturnPortal position={[0, 1.5, 5.5]} />

      <ambientLight intensity={0.08} color="#0e7490" />
      <pointLight position={[0, 5, 0]} intensity={1.2} color="#06b6d4" distance={20} decay={2} />
      <pointLight position={[-3, 3, -3]} intensity={0.5} color="#22d3ee" distance={12} decay={2} />
      <pointLight position={[3, 3, 3]} intensity={0.3} color="#0891b2" distance={10} decay={2} />
      <spotLight
        position={[0, 6, -3]}
        intensity={0.8}
        color="#06b6d4"
        angle={0.4}
        penumbra={0.5}
        distance={15}
        decay={2}
      />

      <fog attach="fog" args={['#020817', 12, 35]} />
    </group>
  );
}
