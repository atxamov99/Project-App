import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio'

let currentPlayer: AudioPlayer | null = null

export async function playAudio(url: string): Promise<void> {
  try {
    if (currentPlayer) {
      currentPlayer.remove()
      currentPlayer = null
    }

    await setAudioModeAsync({ playsInSilentMode: true })

    const player = createAudioPlayer({ uri: url })
    currentPlayer = player
    player.play()
  } catch {
    // silent fail
  }
}

export async function stopAudio(): Promise<void> {
  if (currentPlayer) {
    currentPlayer.remove()
    currentPlayer = null
  }
}
