import { config as dotenvConfig} from 'dotenv';
import { AssemblyAI } from 'assemblyai'

dotenvConfig()

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_KEY
})

const audioUrl =
  './audios/test102.mp3'

const audioConfig = {
  audio_url: audioUrl
}

const run = async () => {
  const transcript = await client.transcripts.create(audioConfig)
  console.log(transcript.text)
}

// run()
