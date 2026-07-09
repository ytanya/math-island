type ToneStep = { frequency: number; startTime: number; duration: number }

let sharedContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null

  const AudioContextCtor =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

  if (!AudioContextCtor) return null

  if (!sharedContext) {
    sharedContext = new AudioContextCtor()
  }

  if (sharedContext.state === 'suspended') {
    void sharedContext.resume()
  }

  return sharedContext
}

function playTones(steps: ToneStep[], waveform: OscillatorType, peakGain: number) {
  const context = getAudioContext()
  if (!context) return

  const now = context.currentTime

  for (const step of steps) {
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.type = waveform
    oscillator.frequency.value = step.frequency

    const startTime = now + step.startTime
    const endTime = startTime + step.duration

    gainNode.gain.setValueAtTime(0, startTime)
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.02)
    gainNode.gain.linearRampToValueAtTime(0, endTime)

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    oscillator.start(startTime)
    oscillator.stop(endTime)
  }
}

const CORRECT_MELODIES: ToneStep[][] = [
  [
    { frequency: 523.25, startTime: 0, duration: 0.12 },
    { frequency: 659.25, startTime: 0.1, duration: 0.12 },
    { frequency: 783.99, startTime: 0.2, duration: 0.18 },
  ],
  [
    { frequency: 587.33, startTime: 0, duration: 0.1 },
    { frequency: 739.99, startTime: 0.08, duration: 0.1 },
    { frequency: 880, startTime: 0.16, duration: 0.1 },
    { frequency: 987.77, startTime: 0.24, duration: 0.18 },
  ],
  [
    { frequency: 659.25, startTime: 0, duration: 0.1 },
    { frequency: 783.99, startTime: 0.09, duration: 0.1 },
    { frequency: 659.25, startTime: 0.18, duration: 0.08 },
    { frequency: 987.77, startTime: 0.26, duration: 0.2 },
  ],
]

export function playCorrectSound() {
  const melody = CORRECT_MELODIES[Math.floor(Math.random() * CORRECT_MELODIES.length)]
  playTones(melody, 'sine', 0.2)
}

export function playWrongSound() {
  playTones(
    [
      { frequency: 196, startTime: 0, duration: 0.22 },
      { frequency: 155.56, startTime: 0.16, duration: 0.24 },
    ],
    'sawtooth',
    0.12,
  )
}

export function playClickSound() {
  playTones([{ frequency: 720, startTime: 0, duration: 0.05 }], 'triangle', 0.1)
}

export function playCelebrationSound() {
  playTones(
    [
      { frequency: 523.25, startTime: 0, duration: 0.14 },
      { frequency: 659.25, startTime: 0.12, duration: 0.14 },
      { frequency: 783.99, startTime: 0.24, duration: 0.14 },
      { frequency: 1046.5, startTime: 0.36, duration: 0.3 },
      { frequency: 783.99, startTime: 0.36, duration: 0.3 },
      { frequency: 659.25, startTime: 0.36, duration: 0.3 },
    ],
    'sine',
    0.18,
  )
}

export function playAchievementSound() {
  playTones(
    [
      { frequency: 783.99, startTime: 0, duration: 0.09 },
      { frequency: 987.77, startTime: 0.07, duration: 0.09 },
      { frequency: 1174.66, startTime: 0.14, duration: 0.09 },
      { frequency: 1567.98, startTime: 0.21, duration: 0.28 },
      { frequency: 1174.66, startTime: 0.21, duration: 0.28 },
    ],
    'triangle',
    0.16,
  )
}

const MUSIC_ENABLED_KEY = 'math-island-music-enabled'
const MUSIC_BPM = 108
const STEP_SECONDS = 60 / MUSIC_BPM / 2
const LOOKAHEAD_SECONDS = 0.15
const SCHEDULER_INTERVAL_MS = 50

// Cheerful C-major pentatonic loop, one octave apart for melody/bass. null = rest.
const MELODY_STEPS: Array<number | null> = [
  523.25, null, 587.33, 659.25,
  783.99, null, 659.25, 587.33,
  523.25, null, 440.0, 523.25,
  587.33, null, 523.25, null,
]

const BASS_STEPS: Array<number | null> = [
  261.63, null, null, null,
  196.0, null, null, null,
  261.63, null, null, null,
  220.0, null, null, null,
]

let musicSchedulerHandle: ReturnType<typeof setInterval> | null = null
let musicNextNoteTime = 0
let musicStepIndex = 0
let musicPlaying = false

function scheduleMusicNote(
  frequency: number,
  time: number,
  duration: number,
  waveform: OscillatorType,
  peakGain: number,
) {
  const context = getAudioContext()
  if (!context) return

  const oscillator = context.createOscillator()
  const gainNode = context.createGain()

  oscillator.type = waveform
  oscillator.frequency.value = frequency

  gainNode.gain.setValueAtTime(0, time)
  gainNode.gain.linearRampToValueAtTime(peakGain, time + 0.02)
  gainNode.gain.linearRampToValueAtTime(0, time + duration)

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)

  oscillator.start(time)
  oscillator.stop(time + duration)
}

function musicScheduler() {
  const context = getAudioContext()
  if (!context) return

  while (musicNextNoteTime < context.currentTime + LOOKAHEAD_SECONDS) {
    const melodyFrequency = MELODY_STEPS[musicStepIndex % MELODY_STEPS.length]
    const bassFrequency = BASS_STEPS[musicStepIndex % BASS_STEPS.length]

    if (melodyFrequency !== null) {
      scheduleMusicNote(melodyFrequency, musicNextNoteTime, STEP_SECONDS * 0.9, 'triangle', 0.05)
    }

    if (bassFrequency !== null) {
      scheduleMusicNote(bassFrequency, musicNextNoteTime, STEP_SECONDS * 1.8, 'sine', 0.045)
    }

    musicStepIndex += 1
    musicNextNoteTime += STEP_SECONDS
  }
}

export function startBackgroundMusic() {
  if (musicPlaying) return

  const context = getAudioContext()
  if (!context) return

  musicPlaying = true
  musicStepIndex = 0
  musicNextNoteTime = context.currentTime + 0.1
  musicScheduler()
  musicSchedulerHandle = setInterval(musicScheduler, SCHEDULER_INTERVAL_MS)
}

export function stopBackgroundMusic() {
  musicPlaying = false

  if (musicSchedulerHandle !== null) {
    clearInterval(musicSchedulerHandle)
    musicSchedulerHandle = null
  }
}

export function isMusicEnabled(): boolean {
  if (typeof localStorage === 'undefined') return true

  const stored = localStorage.getItem(MUSIC_ENABLED_KEY)
  return stored === null ? true : stored === 'true'
}

export function setMusicEnabled(enabled: boolean) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(MUSIC_ENABLED_KEY, String(enabled))
  }

  if (enabled) {
    startBackgroundMusic()
  } else {
    stopBackgroundMusic()
  }
}

export function playCoinSound() {
  playTones(
    [
      { frequency: 1318.51, startTime: 0, duration: 0.08 },
      { frequency: 1567.98, startTime: 0.06, duration: 0.16 },
    ],
    'square',
    0.14,
  )
}

export function playTreasureUnlockSound() {
  playTones(
    [
      { frequency: 440, startTime: 0, duration: 0.1 },
      { frequency: 554.37, startTime: 0.08, duration: 0.1 },
      { frequency: 659.25, startTime: 0.16, duration: 0.1 },
      { frequency: 880, startTime: 0.24, duration: 0.32 },
    ],
    'triangle',
    0.17,
  )
}
