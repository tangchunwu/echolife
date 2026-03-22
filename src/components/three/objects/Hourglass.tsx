import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../../store/gameStore';
import { getDialogueForScene } from '../../../data/dialogues';
import { dialogueEngine } from '../../../systems/DialogueEngine';
import { audioManager } from '../../../systems/AudioManager';

interface HourglassProps {
  position: [number, number, number];
}

const TRIGGER_RADIUS = 2;
const SHOW_LABEL_RADIUS = 3.5;
const EXIT_RADIUS = TRIGGER_RADIUS + 1;

export function Hourglass({ position }: HourglassProps) {
  const topRef = useRef<THREE.Mesh>(null);
  const bottomRef = useRef<THREE.Mesh>(null);
  const sandRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const wasInsideRef = useRef(false);
  const [nearby, setNearby] = useState(false);

  const triggerDialogue = () => {
    const state = useGameStore.getState();
    if (state.phase !== 'playing') return;

    audioManager.playSfx('hourglass');
    const hasKey = state.hasItem('time_key_past');
    const dialogue = getDialogueForScene('hall', hasKey);
    if (dialogue) {
      dialogueEngine.startDialogue(dialogue);
      state.setPhase('dialogue');
    }
  };

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (sandRef.current) {
      sandRef.current.rotation.y = t * 0.5;
      const mat = sandRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.3;
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = nearby
        ? 0.15 + Math.sin(t * 3) * 0.05
        : 0.1 + Math.sin(t * 2) * 0.05;
    }

    const playerPos = useGameStore.getState().playerPosition;
    const dx = playerPos.x - position[0];
    const dz = playerPos.z - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    const isNearby = dist < SHOW_LABEL_RADIUS;
    if (isNearby !== nearby) setNearby(isNearby);

    const isInside = dist < TRIGGER_RADIUS;

    if (isInside && !wasInsideRef.current) {
      wasInsideRef.current = true;
      triggerDialogue();
    }

    if (dist > EXIT_RADIUS) {
      wasInsideRef.current = false;
    }
  });

  return (
    <group position={position}>
      <mesh ref={topRef} position={[0, 0.5, 0]}>
        <coneGeometry args={[0.4, 0.8, 16]} />
        <meshStandardMaterial
          color="#22d3ee"
          transparent
          opacity={0.6}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      <mesh ref={bottomRef} position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.4, 0.8, 16]} />
        <meshStandardMaterial
          color="#22d3ee"
          transparent
          opacity={0.6}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      <mesh ref={sandRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.05, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.05, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.3}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {nearby && (
        <Html center position={[0, 1.5, 0]} className="pointer-events-none select-none">
          <div
            className="px-3 py-1 rounded text-xs tracking-wider whitespace-nowrap backdrop-blur-sm animate-fadeIn"
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#22d3ee',
              border: '1px solid rgba(34,211,238,0.25)',
            }}
          >
            靠近中...
          </div>
        </Html>
      )}
    </group>
  );
}
