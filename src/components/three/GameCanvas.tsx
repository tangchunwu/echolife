import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useGameStore } from '../../store/gameStore';
import { HallScene } from './scenes/HallScene';
import { PastScene } from './scenes/PastScene';
import { FutureScene } from './scenes/FutureScene';
import { ParadoxScene } from './scenes/ParadoxScene';
import { InteractionTrigger } from './objects/InteractionTrigger';
import { PlayerController } from './player/PlayerController';

function SceneSelector() {
  const currentScene = useGameStore((s) => s.currentScene);

  return (
    <>
      {currentScene === 'hall' && <HallScene />}
      {currentScene === 'past' && (
        <>
          <PastScene />
          <InteractionTrigger position={[0, 1.2, -2]} scene="past" />
        </>
      )}
      {currentScene === 'future' && (
        <>
          <FutureScene />
          <InteractionTrigger position={[0, 1.2, -2]} scene="future" />
        </>
      )}
      {currentScene === 'paradox' && (
        <>
          <ParadoxScene />
          <InteractionTrigger position={[0, 1.2, 0]} scene="paradox" />
        </>
      )}
    </>
  );
}

function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={0.6} mipmapBlur />
      <Vignette offset={0.3} darkness={0.5} />
    </EffectComposer>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#22d3ee" wireframe />
    </mesh>
  );
}

function CameraSystem() {
  const orbitRef = useRef<{ target: import('three').Vector3 }>(null);

  return (
    <>
      <PlayerController orbitRef={orbitRef} />
      <OrbitControls
        ref={orbitRef as React.RefObject<never>}
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        target={[0, 1, 3]}
      />
    </>
  );
}

export function GameCanvas() {
  const phase = useGameStore((s) => s.phase);

  if (phase === 'menu') return null;

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 4, 11], fov: 60, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#020817']} />

        <Suspense fallback={<LoadingFallback />}>
          <SceneSelector />
          <Preload all />
        </Suspense>

        <CameraSystem />
        <PostProcessing />
      </Canvas>
    </div>
  );
}
