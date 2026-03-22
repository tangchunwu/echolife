import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../../store/gameStore';
import { dialogueEngine } from '../../../systems/DialogueEngine';
import { getDialogueForScene } from '../../../data/dialogues';

interface InteractionTriggerProps {
  position: [number, number, number];
  scene: 'past' | 'future' | 'paradox';
}

const COLORS: Record<string, string> = {
  past: '#f59e0b',
  future: '#06b6d4',
  paradox: '#f43f5e',
};

const TRIGGER_RADIUS = 1.8;
const SHOW_LABEL_RADIUS = 3.5;
const EXIT_RADIUS = TRIGGER_RADIUS + 1;

export function InteractionTrigger({ position, scene }: InteractionTriggerProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const [nearby, setNearby] = useState(false);
  const wasInsideRef = useRef(false);
  const color = COLORS[scene];

  const completedFlag = `${scene}_dialogue_completed`;

  const triggerDialogue = () => {
    const state = useGameStore.getState();
    if (state.phase !== 'playing') return;
    if (state.hasFlag(completedFlag)) return;

    const flagKey = `${scene}_dialogue_started`;
    const hasVisited = state.hasFlag(flagKey);
    const dialogue = getDialogueForScene(scene, hasVisited);
    if (dialogue) {
      dialogueEngine.startDialogue(dialogue);
      state.setPhase('dialogue');
      if (!hasVisited) {
        state.setFlag(flagKey, true);
      }
    }
  };

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    const completed = useGameStore.getState().hasFlag(completedFlag);

    if (ringRef.current) {
      ringRef.current.rotation.y = t * 2;
      const s = nearby && !completed
        ? 1.2 + Math.sin(t * 4) * 0.08
        : 1 + Math.sin(t * 3) * 0.05;
      ringRef.current.scale.setScalar(s);
    }
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = nearby && !completed ? 0.12 : 0.04 + Math.sin(t * 2) * 0.02;
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

  const beamGeometry = useMemo(() => new THREE.CylinderGeometry(0.08, 0.08, 3, 8), []);
  const completed = useGameStore((s) => s.flags[completedFlag]);

  return (
    <group position={position}>
      <mesh ref={beamRef} position={[0, 1.5, 0]} geometry={beamGeometry}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={completed ? 0.2 : 0.8}
          transparent
          opacity={0.06}
        />
      </mesh>

      <mesh ref={ringRef}>
        <torusGeometry args={[0.4, 0.04, 8, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={completed ? 0.2 : nearby ? 1.2 : 0.5}
          transparent
          opacity={completed ? 0.3 : 0.8}
        />
      </mesh>

      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.1}
        />
      </mesh>

      <pointLight
        intensity={completed ? 0.1 : nearby ? 0.8 : 0.3}
        color={color}
        distance={4}
        decay={2}
      />

      {nearby && !completed && (
        <Html center position={[0, 0.9, 0]} className="pointer-events-none select-none">
          <div
            className="px-3 py-1 rounded text-xs tracking-wider whitespace-nowrap backdrop-blur-sm animate-fadeIn"
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              color,
              border: `1px solid ${color}40`,
            }}
          >
            靠近中...
          </div>
        </Html>
      )}
    </group>
  );
}
