import { GameCanvas } from './components/three/GameCanvas';
import { MainMenu } from './components/ui/MainMenu';
import { GameHUD } from './components/ui/GameHUD';
import { DialoguePanel } from './components/ui/DialoguePanel';
import { PauseMenu } from './components/ui/PauseMenu';
import { TransitionOverlay } from './components/ui/TransitionOverlay';
import { EndingScreen } from './components/ui/EndingScreen';
import { BgmController } from './components/audio/BgmController';
import { useGameInput } from './hooks/useGameInput';
import { usePlayTimer } from './hooks/usePlayTimer';

function App() {
  useGameInput();
  usePlayTimer();

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#020817]">
      <BgmController />
      <MainMenu />
      <GameCanvas />
      <GameHUD />
      <DialoguePanel />
      <PauseMenu />
      <TransitionOverlay />
      <EndingScreen />
    </div>
  );
}

export default App;
