import { useState } from 'react'
import { Button } from 'animal-island-ui'
import { isMusicEnabled, setMusicEnabled } from '../utils/sound'

interface MusicToggleButtonProps {
  className?: string
}

export function MusicToggleButton({ className }: MusicToggleButtonProps) {
  const [musicOn, setMusicOn] = useState(() => isMusicEnabled())

  const handleToggle = () => {
    const next = !musicOn
    setMusicOn(next)
    setMusicEnabled(next)
  }

  return (
    <Button
      aria-label={musicOn ? 'Turn music off' : 'Turn music on'}
      className={className}
      data-testid="music-toggle-button"
      htmlType="button"
      onClick={handleToggle}
      size="small"
      type="text"
    >
      {musicOn ? '🔊' : '🔇'}
    </Button>
  )
}

export default MusicToggleButton
