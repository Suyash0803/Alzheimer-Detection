import MicRecorder from "mic-recorder-to-mp3"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ReactMic } from "react-mic"
import AudioTimer from "./AudioTimer"
import axios from "axios"
import './RecorderStyles.css'

const PORT = process.env.REACT_APP_PORT;
const ASSEMBLY_API_KEY = process.env.REACT_APP_ASSEMBLYAI_KEY;

// Set AssemblyAI Axios Header
const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: ASSEMBLY_API_KEY,
        "content-type": "application/json",
    },
})

const App = () => {
    const navigate = useNavigate()
    const recorder = useRef(null) //Recorder
    const audioPlayer = useRef(null) //Ref for the HTML Audio
    const [elapsedTime, setElapsedTime] = useState(0)
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

    // AssemblyAI API

    // State variables
    const [uploadURL, setUploadURL] = useState("")
    const [transcriptID, setTranscriptID] = useState("")
    const [transcriptData, setTranscriptData] = useState("")
    const [transcript, setTranscript] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Upload the Audio File and retrieve the Upload URL
    useEffect(() => {
        if (audioFile) {
            assembly
                .post("/upload", audioFile)
                .then((res) => setUploadURL(res.data.upload_url))
                .catch((err) => console.error(err))
        }
    }, [audioFile])

    // Submit the Upload URL to AssemblyAI and retrieve the Transcript ID
    const submitTranscriptionHandler = () => {
        assembly
            .post("/transcript", {
                audio_url: uploadURL,
            })
            .then(async (res) => {
                setTranscriptID(res.data.id)

                checkStatusHandler()
                // direct api to trigger model here
                const requestData = {
                    "data": JSON.stringify(transcriptData),
                }
                const response = await axios.post(`http://localhost:${PORT}/predict`, requestData, {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                })
                console.log('Transcript sent successfully:', transcriptData);
                const result = response.data
                
                if(result) {
                    console.log(result)
                    navigate('/result', { state: { result: result } })
                }
            })
            .catch((err) => console.error(err))
    }

    // Check the status of the Transcript
    const checkStatusHandler = async () => {
        setIsLoading(true)
        try {
            await assembly.get(`/transcript/${transcriptID}`).then((res) => {
                setTranscriptData(res.data)
            })
        } catch (err) {
            console.error(err)
        }
    }

    // Periodically check the status of the Transcript
    useEffect(() => {
        const interval = setInterval(() => {
            if (transcriptData.status !== "completed" && isLoading) {
                checkStatusHandler()
            } else {
                setIsLoading(false)
                setTranscript(transcriptData.text)

                clearInterval(interval)
            }
        }, 1000)
        return () => clearInterval(interval)
    },)

    return (
        <div className="recorder-container">
            <h2 className="title">Audio Recorder</h2>
            <AudioTimer isRunning={isRecording} elapsedTime={elapsedTime} setElapsedTime={setElapsedTime} />

            <ReactMic
                record={isRecording}
                className="sound-wave"
                strokeColor="#000000"
            />
            {audioFile && <audio ref={audioPlayer} src={blobURL} controls='controls' />}

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
                <button onClick={submitTranscriptionHandler} className="start-button">SUBMIT</button>
            </div>
            {transcriptData.status === "completed" ? (
                <p>{transcript}</p>
            ) : (
                <p>{transcriptData.status}</p>
            )}
        </div>
    )
}

export default App
