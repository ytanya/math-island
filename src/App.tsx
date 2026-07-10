import { useEffect, useState } from 'react';

import {
  CAMBRIDGE_PRIMARY_MATH_BOOK1,
  CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
  getNextUnitId,
} from './curriculums/cambridgePrimaryMathBook1';
import { HomeScreen } from './screens/HomeScreen';
import { IslandCompleteScreen } from './screens/IslandCompleteScreen';
import { ParentScreen } from './screens/ParentScreen';
import { QuizScreen } from './screens/QuizScreen';
import { completeTreasure, loadProfile, saveProfile } from './store/profileStore';
import { isMusicEnabled, startBackgroundMusic } from './utils/sound';

interface PendingCoinAnimation {
  unitId: string;
  coinsEarned: number;
}

export default function App() {
  const [profile, setProfile] = useState(() => loadProfile());
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [showParents, setShowParents] = useState(false);
  const [pendingCoinAnimation, setPendingCoinAnimation] = useState<PendingCoinAnimation | null>(
    null,
  );
  const [islandJustCompleted, setIslandJustCompleted] = useState(false);
  const [showIslandComplete, setShowIslandComplete] = useState(false);

  useEffect(() => {
    const startMusicOnFirstGesture = () => {
      if (isMusicEnabled()) {
        startBackgroundMusic();
      }
      window.removeEventListener('pointerdown', startMusicOnFirstGesture);
      window.removeEventListener('keydown', startMusicOnFirstGesture);
    };

    window.addEventListener('pointerdown', startMusicOnFirstGesture);
    window.addEventListener('keydown', startMusicOnFirstGesture);

    return () => {
      window.removeEventListener('pointerdown', startMusicOnFirstGesture);
      window.removeEventListener('keydown', startMusicOnFirstGesture);
    };
  }, []);

  const handleQuizComplete = (unitId: string, coinsEarned: number) => {
    const nextUnitId = getNextUnitId(CAMBRIDGE_PRIMARY_MATH_BOOK1, unitId);
    const { profile: updatedProfile, coinsAwarded } = completeTreasure(
      profile,
      CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
      unitId,
      coinsEarned,
      nextUnitId,
    );

    saveProfile(updatedProfile);
    setProfile(updatedProfile);
    setActiveUnitId(null);

    if (coinsAwarded > 0) {
      setPendingCoinAnimation({ unitId, coinsEarned: coinsAwarded });

      if (nextUnitId === null) {
        setIslandJustCompleted(true);
      }
    }
  };

  const handleCoinAnimationComplete = () => {
    setPendingCoinAnimation(null);

    if (islandJustCompleted) {
      setIslandJustCompleted(false);
      setShowIslandComplete(true);
    }
  };

  if (showIslandComplete) {
    return (
      <IslandCompleteScreen bells={profile.bells} onClose={() => setShowIslandComplete(false)} />
    );
  }

  if (showParents) {
    return <ParentScreen profile={profile} onClose={() => setShowParents(false)} />;
  }

  if (activeUnitId !== null) {
    return (
      <QuizScreen
        unitId={activeUnitId}
        onComplete={handleQuizComplete}
        onExit={() => setActiveUnitId(null)}
      />
    );
  }

  return (
    <HomeScreen
      onCoinAnimationComplete={handleCoinAnimationComplete}
      onOpenParents={() => setShowParents(true)}
      onPlayTreasure={setActiveUnitId}
      pendingCoinAnimation={pendingCoinAnimation}
      profile={profile}
    />
  );
}
