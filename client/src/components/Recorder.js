import React from 'react';
import AudioTimer from './AudioTimer';
import { ReactMic } from 'react-mic';
import axios from 'axios';
import lamejs from 'lamejs';
import './RecorderStyles.css';

const PORT = 3001

const Recorder = () => {
    const [isRunning, setIsRunning] = React.useState(false);
    const [elapsedTime, setElapsedTime] = React.useState(0);
    const [voice, setVoice] = React.useState(false);
    const [recordedBlob, setRecordedBlob] = React.useState(null);
    const [recordBlobLink, setRecordBlobLink] = React.useState(null);

    const onStop = (recordedBlobAudio) => {
        setRecordedBlob(recordedBlobAudio);
        console.log(recordedBlobAudio);
        setRecordBlobLink(recordedBlobAudio.blobURL);
        setIsRunning(false);
    };

    const startHandle = () => {
        setElapsedTime(0);
        setIsRunning(true);
        setVoice(true);
    };

    const stopHandle = () => {
        setIsRunning(false);
        setVoice(false);
    };

    const clearHandle = () => {
        setIsRunning(false);
        setVoice(false);
        setRecordBlobLink(null);
        setElapsedTime(0);
    };

    const handleSubmit = async () => {
        try {
            const mp3Blob = await convertToMp3(recordedBlob.blob);
            const mp3File = new File([mp3Blob], 'audio.mp3', { type: 'audio/mp3' });

            const formData = new FormData();
            formData.append('audio', mp3File);
            const response = await axios.post(`http://localhost:${PORT}/api/assessment-audio`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Audio saved successfully:', response.data);
        } catch (error) {
            console.log(recordedBlob)
            console.log('Error saving audio:', error);
        }
    };

    const convertToMp3 = async recordedBlob => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioData = await recordedBlob.arrayBuffer();

        return new Promise((resolve, reject) => {
            audioContext.decodeAudioData(audioData, decodedData => {
                const mp3Encoder = new lamejs.Mp3Encoder(1, decodedData.sampleRate, 128);
                const samples = new Int16Array(decodedData.getChannelData(0) * 32767);
                const mp3Buffer = mp3Encoder.encodeBuffer(samples);

                const mp3Blob = new Blob([new Uint8Array(mp3Buffer)], { type: 'audio/mp3' });
                resolve(mp3Blob);
            });
        });
    }

    return (
        <div>
            <div className="recorder-container">
                <h2 className="title">Audio Recorder</h2>
                <AudioTimer isRunning={isRunning} elapsedTime={elapsedTime} setElapsedTime={setElapsedTime} />

                <ReactMic
                    record={voice}
                    className="sound-wave"
                    onStop={onStop}
                    strokeColor="#000000"
                />
                <div className="button-container">
                    {recordBlobLink ? <button onClick={clearHandle} className="clear-button">Clear</button> : ""}
                    {!voice ? <button onClick={startHandle} className="start-button">Start</button> : <button onClick={stopHandle} className="stop-button">Stop</button>}
                </div>
                <div className="audio-container">
                    {recordBlobLink ? <audio controls src={recordBlobLink} className="audio-element" /> : ""}
                </div>

                <div className="button-container">
                    {recordBlobLink ? <button onClick={handleSubmit} >Submit</button> : ""}
                </div>
            </div>
        </div>
    );
};

export default Recorder;
