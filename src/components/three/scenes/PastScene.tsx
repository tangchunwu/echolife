import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { PastSelfCharacter } from '../characters/PastSelf';
import { MemoryFragment } from '../objects/MemoryFragment';
import { ReturnPortal } from '../objects/ReturnPortal';

function Lantern({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const t = state.clock.elapsedTime;
      lightRef.current.intensity = 1.2 + Math.sin(t * 8) * 0.15 + Math.sin(t * 13) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.3, 8]} />
        <meshStandardMaterial color="#8B6914" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.8}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, 0.4, 0]}
        intensity={1.2}
        color="#f59e0b"
        distance={8}
        decay={2}
      />
    </group>
  );
}

export function PastScene() {
  const dustRef = useRef<THREE.Points>(null);

  const dustPositions = useMemo(() => {
    const pos = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = Math.random() * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (dustRef.current) {
      dustRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const positions = dustRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 300; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001;
        if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = 0;
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#8B6914" roughness={0.9} metalness={0.1} />
      </mesh>

      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#8B2500" roughness={0.95} metalness={0} transparent opacity={0.7} />
      </mesh>

      {[[-6, 0, -6], [6, 0, -6], [-6, 0, 6], [6, 0, 6]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.3, 4, 0.3]} />
          <meshStandardMaterial color="#5c3d1a" roughness={0.8} />
        </mesh>
      ))}

      {[[-6, 2, 0], [6, 2, 0], [0, 2, -6], [0, 2, 6]].map((pos, i) => (
        <mesh key={`wall-${i}`} position={pos as [number, number, number]}
          rotation={[0, i < 2 ? 0 : Math.PI / 2, 0]}>
          <planeGeometry args={[12, 4]} />
          <meshStandardMaterial
            color="#d4a56a"
            roughness={0.9}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}

      <mesh position={[2, 2, -5.8]}>
        <planeGeometry args={[3, 2.5]} />
        <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[2, 2, -5.75]}>
        <planeGeometry args={[3.2, 2.7]} />
        <meshStandardMaterial
          color="#87CEEB"
          emissive="#fde68a"
          emissiveIntensity={0.15}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {[[-4, 2.2, -5.8], [-2, 2, -5.8]].map((pos, i) => (
        <group key={`frame-${i}`} position={pos as [number, number, number]}>
          <mesh>
            <planeGeometry args={[0.8, 0.6]} />
            <meshStandardMaterial
              color={i === 0 ? '#a0522d' : '#6b4423'}
              roughness={0.8}
            />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.65, 0.45]} />
            <meshStandardMaterial
              color={i === 0 ? '#fde68a' : '#d4a56a'}
              emissive={i === 0 ? '#f59e0b' : '#d97706'}
              emissiveIntensity={0.1}
            />
          </mesh>
        </group>
      ))}

      <group position={[-4, 0, -4]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i}>
            <mesh position={[0, 0.5 + i * 0.6, 0]}>
              <boxGeometry args={[1.5, 0.05, 0.6]} />
              <meshStandardMaterial color="#6b3a1f" roughness={0.8} />
            </mesh>
            {Array.from({ length: 4 }, (_, j) => (
              <mesh key={j} position={[-0.5 + j * 0.35, 0.55 + i * 0.6, 0]}
                rotation={[0, 0, (Math.random() - 0.5) * 0.15]}>
                <boxGeometry args={[0.18, 0.25, 0.4]} />
                <meshStandardMaterial
                  color={['#8B4513', '#A0522D', '#6B4423', '#7B5B3A'][j]}
                  roughness={0.9}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.8]} />
          <meshStandardMaterial color="#5c3d1a" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.81, 0]}>
          <boxGeometry args={[1.3, 0.05, 0.9]} />
          <meshStandardMaterial color="#6b4423" roughness={0.6} />
        </mesh>
      </group>

      <Lantern position={[0.4, 0.84, 0.25]} />

      <Float speed={1.5} floatIntensity={0.3}>
        <PastSelfCharacter position={[0, 0, -2]} />
      </Float>

      <Float speed={2} floatIntensity={0.5}>
        <MemoryFragment position={[3, 1.5, 2]} color="#f59e0b" itemId="memory_fragment_1" />
      </Float>
      <Float speed={1.8} floatIntensity={0.4}>
        <MemoryFragment position={[-3, 2, -1]} color="#fbbf24" itemId="memory_fragment_2" />
      </Float>

      <ReturnPortal position={[0, 1.5, 5.5]} />

      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial color="#f59e0b" size={0.04} transparent opacity={0.5} sizeAttenuation />
      </points>

      <ambientLight intensity={0.25} color="#fde68a" />
      <pointLight position={[2, 3, -5]} intensity={1.5} color="#f59e0b" distance={15} decay={2} />
      <pointLight position={[-2, 2, 2]} intensity={0.5} color="#fbbf24" distance={10} decay={2} />
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color="#fde68a" distance={5} decay={2} />
      <directionalLight position={[3, 5, 2]} intensity={0.3} color="#fde68a" />

      <fog attach="fog" args={['#2a1a0a', 8, 25]} />
    </group>
  );
}
