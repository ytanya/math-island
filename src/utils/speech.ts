function getSpeechSynthesis(): SpeechSynthesis | null {
  if (typeof window === 'undefined') return null
  return window.speechSynthesis ?? null
}

export function isSpeechSupported(): boolean {
  return getSpeechSynthesis() !== null
}

export function speakText(text: string): void {
  const synth = getSpeechSynthesis()
  if (!synth) return

  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.85
  utterance.pitch = 1.1

  synth.speak(utterance)
}
