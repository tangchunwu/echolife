import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { PastSelfCharacter } from '../characters/PastSelf';
import { FutureSelfCharacter } from '../characters/FutureSelf';
import { ReturnPortal } from '../objects/ReturnPortal';

function EnergyVortex() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 250;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#f59e0b'),
      new THREE.Color('#10b981'),
      new THREE.Color('#06b6d4'),
    ];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 6;
      const r = 0.5 + (i / count) * 3.5;
      const y = (i / count) * 7;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      const c = palette[i % 3];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export function ParadoxScene() {
  const platformRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const ringRef3 = useRef<THREE.Mesh>(null);
  const lightPillarRef = useRef<THREE.Mesh>(null);
  const nexusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (platformRef.current) {
      platformRef.current.rotation.y = t * 0.05;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x = t * 0.5;
      ringRef1.current.rotation.z = t * 0.3;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y = t * 0.4;
      ringRef2.current.rotation.x = t * 0.2;
    }
    if (ringRef3.current) {
      ringRef3.current.rotation.z = t * 0.6;
      ringRef3.current.rotation.y = t * 0.35;
    }
    if (lightPillarRef.current) {
      const mat = lightPillarRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.3;
      mat.opacity = 0.3 + Math.sin(t * 2) * 0.1;
    }
    if (nexusRef.current) {
      nexusRef.current.rotation.x = t * 0.8;
      nexusRef.current.rotation.y = t * 1.2;
      const s = 1 + Math.sin(t * 2) * 0.15;
      nexusRef.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <group ref={platformRef}>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[6, 6, 0.3, 3]} />
          <meshStandardMaterial
            color="#1a0a2e"
            metalness={0.7}
            roughness={0.3}
            emissive="#2d1b69"
            emissiveIntensity={0.2}
          />
        </mesh>

        {[0, 1, 2].map((i) => {
          const angle = (i * Math.PI * 2) / 3;
          const x = Math.cos(angle) * 4;
          const z = Math.sin(angle) * 4;
          const colors = ['#f59e0b', '#10b981', '#06b6d4'];
          return (
            <group key={i}>
              <mesh position={[x, -0.14, z]}>
                <cylinderGeometry args={[0.8, 0.8, 0.02, 32]} />
                <meshStandardMaterial
                  color={colors[i]}
                  emissive={colors[i]}
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.7}
                />
              </mesh>
              <mesh position={[x, -0.12, z]}>
                <cylinderGeometry args={[1, 1, 0.01, 32]} />
                <meshStandardMaterial
                  color={colors[i]}
                  emissive={colors[i]}
                  emissiveIntensity={0.2}
                  transparent
                  opacity={0.15}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      <mesh ref={nexusRef} position={[0, 3, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh ref={lightPillarRef} position={[0, 4, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 8, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      <EnergyVortex />

      <mesh ref={ringRef1} position={[0, 3, 0]}>
        <torusGeometry args={[2, 0.05, 16, 64]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh ref={ringRef2} position={[0, 3, 0]}>
        <torusGeometry args={[2.5, 0.05, 16, 64]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh ref={ringRef3} position={[0, 3, 0]}>
        <torusGeometry args={[3, 0.05, 16, 64]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      <Float speed={1.5} floatIntensity={0.3}>
        <PastSelfCharacter position={[-3.5, 0, -2]} />
      </Float>
      <Float speed={1.5} floatIntensity={0.3}>
        <FutureSelfCharacter position={[3.5, 0, -2]} />
      </Float>

      <ReturnPortal position={[0, 1.5, 5]} />

      <ambientLight intensity={0.08} color="#2d1b69" />
      <pointLight position={[0, 6, 0]} intensity={2} color="#ffffff" distance={20} decay={2} />
      <pointLight position={[-4, 2, -2]} intensity={0.8} color="#f59e0b" distance={12} decay={2} />
      <pointLight position={[4, 2, -2]} intensity={0.8} color="#06b6d4" distance={12} decay={2} />
      <pointLight position={[0, 2, 4]} intensity={0.8} color="#10b981" distance={12} decay={2} />
      <pointLight position={[0, 3, 0]} intensity={1} color="#ffffff" distance={8} decay={2} />

      <fog attach="fog" args={['#0a0015', 10, 35]} />
    </group>
  );
}
