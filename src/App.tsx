import { type ComponentProps, useEffect, useState } from 'react';

import { HomeScreen } from './screens/HomeScreen';
import { ParentScreen } from './screens/ParentScreen';
import { QuizScreen } from './screens/QuizScreen';
import { loadProfile } from './store/profileStore';
import { isMusicEnabled, startBackgroundMusic } from './utils/sound';

type SkillId = Parameters<ComponentProps<typeof HomeScreen>['onPlaySkill']>[0];

export default function App() {
  const [profile, setProfile] = useState(() => loadProfile());
  const [activeSkill, setActiveSkill] = useState<SkillId | null>(null);
  const [showParents, setShowParents] = useState(false);

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

  if (showParents) {
    return (
      <ParentScreen
        profile={profile}
        onClose={() => setShowParents(false)}
      />
    );
  }

  if (activeSkill === null) {
    return (
      <HomeScreen
        profile={profile}
        onOpenParents={() => setShowParents(true)}
        onPlaySkill={setActiveSkill}
      />
    );
  }

  return (
    <QuizScreen
      skillId={activeSkill}
      profile={profile}
      onProfileChange={setProfile}
      onExit={() => setActiveSkill(null)}
    />
  );
}
