import { Button, Tag, Time, Title, Wallet } from 'animal-island-ui'
import islandMap from '../assets/adventure-island.png'
import { MusicToggleButton } from '../components/MusicToggleButton'
import type { ChildProfile, SkillId } from '../types'
import { playClickSound } from '../utils/sound'
import './HomeScreen.css'

interface HomeScreenProps {
  profile: ChildProfile
  onPlaySkill: (skillId: SkillId) => void
  onOpenParents?: () => void
}

const skills: Array<{
  id: SkillId
  name: string
  emoji: string
  left: string
  top: string
}> = [
  { id: 'addSub', name: 'Add & Subtract', emoji: '➕', left: '26.3%', top: '28.5%' },
  { id: 'comparing', name: 'Comparing', emoji: '⚖️', left: '52.8%', top: '66.4%' },
  { id: 'counting', name: 'Counting', emoji: '🔢', left: '49.6%', top: '82.1%' },
  { id: 'placeValue', name: 'Tens & Ones', emoji: '💯', left: '77.7%', top: '55.3%' },
]

export function HomeScreen({
  profile,
  onPlaySkill,
  onOpenParents,
}: HomeScreenProps) {
  return (
    <main className="home-screen" data-testid="home-screen">
      <section className="home-screen__map" aria-label="Math Island map">
        <img
          alt="Illustrated treasure island map"
          className="home-screen__map-image"
          src={islandMap}
        />

        <header className="home-screen__header">
          <div className="home-screen__title">
            <Title size="large" color="app-yellow">
              Math Island
            </Title>
            <Time className="home-screen__time" />
          </div>

          <div className="home-screen__actions">
            <Wallet value={profile.bells} size="medium" />
            <div className="home-screen__action-buttons">
              <MusicToggleButton />
              {onOpenParents ? (
                <Button size="small" type="text" onClick={onOpenParents}>
                  Parents
                </Button>
              ) : null}
            </div>
          </div>
        </header>

        {skills.map((skill) => {
          const mastered = profile.progress[skill.id].mastered

          return (
            <div
              className="home-screen__skill-hotspot"
              data-testid={`skill-card-${skill.id}`}
              key={skill.id}
              style={{ left: skill.left, top: skill.top }}
            >
              <Button
                className="home-screen__skill-marker"
                data-testid={`play-button-${skill.id}`}
                htmlType="button"
                onClick={() => {
                  playClickSound()
                  onPlaySkill(skill.id)
                }}
                type="primary"
              >
                <span className="home-screen__skill-emoji" aria-hidden="true">
                  {skill.emoji}
                </span>
                <span className="home-screen__skill-name">{skill.name}</span>
                <div className="home-screen__tag-slot">
                  {mastered ? (
                    <span data-testid={`mastered-tag-${skill.id}`}>
                      <Tag color="app-green" size="small">
                        Mastered
                      </Tag>
                    </span>
                  ) : null}
                </div>
              </Button>
            </div>
          )
        })}
      </section>
    </main>
  )
}

export default HomeScreen
