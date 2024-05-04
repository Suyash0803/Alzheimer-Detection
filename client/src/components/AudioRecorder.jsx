import MicRecorder from "mic-recorder-to-mp3"
import { useEffect, useState, useRef } from "react"
import {ReactMic} from 'react-mic'
import AudioTimer from './AudioTimer'
import axios from "axios"
import './RecorderStyles.css'

const PORT = 3001;

const AudioRecorder = () => {
  const recorder = useRef(null)
  const audioPlayer = useRef(null)
  const [elapsedTime, setElapsedTime] = useState(0);
  const [blobURL, setBlobUrl] = useState(null)
  const [audioFile, setAudioFile] = useState(null)
  const [isRecording, setIsRecording] = useState(null)

  useEffect(() => {
    recorder.current = new MicRecorder({ bitRate: 128 })
  }, [])

  const startRecording = () => {
    setElapsedTime(0)
    recorder.current.start().then(() => {
      setIsRecording(true)
    })
  }

  const stopRecording = () => {
    recorder.current
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const file = new File(buffer, "audio.mp3", {
          type: blob.type,
          lastModified: Date.now(),
        })
        const newBlobUrl = URL.createObjectURL(blob)
        setBlobUrl(newBlobUrl)
        setIsRecording(false)
        setAudioFile(file)
      })
      .catch((e) => console.log(e))
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      const response = await axios.post(`http://localhost:${PORT}/api/assessment-audio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Audio saved successfully:', response.data);
    } catch (error) {
      console.log('Error saving audio', error)
    }
  }

  return (
    <div className="recorder-container">
      <h2 className="title">Audio Recorder</h2>
      <AudioTimer isRunning={isRecording} elapsedTime={elapsedTime} setElapsedTime={setElapsedTime} />
      
      <ReactMic
        record={isRecording}
        className="sound-wave"
        strokeColor="#000000"
      />

      <audio ref={audioPlayer} src={blobURL} controls='controls' />

      {!isRecording ?
        <div className="button-container">
          <button onClick={startRecording} className="start-button">
            START
          </button>
        </div>
        :
        <div className="button-container">
          <button onClick={stopRecording} className="start-button">
            STOP
          </button>
        </div>}
      <div className="button-container">
        <button onClick={handleSubmit} className="start-button">SUBMIT</button>
      </div>
    </div>
  )
}

export default AudioRecorder
