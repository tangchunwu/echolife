import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../../store/gameStore';
import type { SceneId } from '../../../types/game';

const pressed: Record<string, boolean> = {};

const SCENE_BOUNDS: Record<SceneId, { type: 'circle' | 'rect'; radius?: number; halfSize?: number }> = {
  hall: { type: 'circle', radius: 7 },
  past: { type: 'rect', halfSize: 5.5 },
  future: { type: 'rect', halfSize: 5.5 },
  paradox: { type: 'circle', radius: 5 },
};

const SPAWN_POSITIONS: Record<SceneId, [number, number, number]> = {
  hall: [0, 0.3, 3],
  past: [0, 0.3, 4],
  future: [0, 0.3, 4],
  paradox: [0, 0.3, 3],
};

const MOVE_SPEED = 4;
const FRICTION = 0.88;

interface PlayerControllerProps {
  orbitRef: React.RefObject<{ target: THREE.Vector3 }>;
}

export function PlayerController({ orbitRef }: PlayerControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  const trailRefs = useRef<THREE.Mesh[]>([]);
  const phase = useGameStore((s) => s.phase);
  const currentScene = useGameStore((s) => s.currentScene);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const prevScene = useRef(currentScene);
  const trailPositions = useRef<THREE.Vector3[]>(
    Array.from({ length: 5 }, () => new THREE.Vector3())
  );

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => { pressed[e.code] = true; };
    const onUp = (e: KeyboardEvent) => { pressed[e.code] = false; };
    const onBlur = () => { Object.keys(pressed).forEach(k => { pressed[k] = false; }); };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  useEffect(() => {
    if (currentScene !== prevScene.current) {
      prevScene.current = currentScene;
      if (groupRef.current) {
        const spawn = SPAWN_POSITIONS[currentScene];
        groupRef.current.position.set(spawn[0], spawn[1], spawn[2]);
        velocity.current.set(0, 0, 0);
        trailPositions.current.forEach(p => p.set(spawn[0], spawn[1], spawn[2]));
      }
    }
  }, [currentScene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;

    if (innerGlowRef.current) {
      const mat = innerGlowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(t * 3) * 0.2;
    }

    const pos = groupRef.current.position;

    trailPositions.current.unshift(pos.clone());
    trailPositions.current.pop();
    trailRefs.current.forEach((mesh, i) => {
      if (mesh) {
        const tp = trailPositions.current[i + 1];
        if (tp) {
          mesh.position.copy(tp).sub(pos);
          const scale = 1 - (i + 1) * 0.18;
          mesh.scale.setScalar(Math.max(scale, 0.1));
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.opacity = Math.max(0.15 - i * 0.03, 0);
        }
      }
    });

    if (phase !== 'playing') return;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const dir = new THREE.Vector3(0, 0, 0);
    if (pressed['KeyW'] || pressed['ArrowUp']) dir.add(forward);
    if (pressed['KeyS'] || pressed['ArrowDown']) dir.sub(forward);
    if (pressed['KeyA'] || pressed['ArrowLeft']) dir.sub(right);
    if (pressed['KeyD'] || pressed['ArrowRight']) dir.add(right);

    const isMoving = dir.lengthSq() > 0;
    if (isMoving) {
      dir.normalize();
      velocity.current.lerp(dir.multiplyScalar(MOVE_SPEED), 0.15);
    } else {
      velocity.current.multiplyScalar(FRICTION);
    }

    pos.x += velocity.current.x * delta;
    pos.z += velocity.current.z * delta;

    const bounds = SCENE_BOUNDS[currentScene];
    if (bounds.type === 'circle') {
      const r = bounds.radius!;
      const dist = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
      if (dist > r) {
        pos.x *= r / dist;
        pos.z *= r / dist;
      }
    } else {
      const hs = bounds.halfSize!;
      pos.x = THREE.MathUtils.clamp(pos.x, -hs, hs);
      pos.z = THREE.MathUtils.clamp(pos.z, -hs, hs);
    }

    const baseY = SPAWN_POSITIONS[currentScene][1];
    if (isMoving) {
      pos.y = baseY + Math.sin(t * 6) * 0.06;
    } else {
      pos.y = THREE.MathUtils.lerp(pos.y, baseY + Math.sin(t * 2) * 0.03, 0.1);
    }

    if (velocity.current.lengthSq() > 0.01) {
      const targetAngle = Math.atan2(velocity.current.x, velocity.current.z);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetAngle,
        0.1
      );
    }

    if (orbitRef.current) {
      const target = orbitRef.current.target;
      target.x = THREE.MathUtils.lerp(target.x, pos.x, 0.08);
      target.y = THREE.MathUtils.lerp(target.y, 1, 0.08);
      target.z = THREE.MathUtils.lerp(target.z, pos.z, 0.08);
    }

    setPlayerPosition({ x: pos.x, y: pos.y, z: pos.z });
  });

  const spawn = SPAWN_POSITIONS[currentScene];

  return (
    <group ref={groupRef} position={spawn}>
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color="#e0f2fe"
          emissive="#67e8f9"
          emissiveIntensity={0.8}
        />
      </mesh>

      <mesh ref={innerGlowRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.4}
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.15}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {Array.from({ length: 4 }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) trailRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.3}
            transparent
            opacity={0.12}
          />
        </mesh>
      ))}

      <pointLight
        position={[0, -0.2, 0]}
        intensity={0.6}
        color="#22d3ee"
        distance={3}
        decay={2}
      />
    </group>
  );
}
