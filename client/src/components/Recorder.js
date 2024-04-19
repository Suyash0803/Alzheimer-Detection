import React from 'react';
import AudioTimer from './AudioTimer';
import { ReactMic } from 'react-mic';
import axios from 'axios';
import './RecorderStyles.css';

const Recorder = () => {
    const [isRunning, setIsRunning] = React.useState(false);
    const [elapsedTime, setElapsedTime] = React.useState(0);
    const [voice, setVoice] = React.useState(false);
    const [recordBlobLink, setRecordBlobLink] = React.useState(null);

    const onStop = (recordedBlob) => {
        setRecordBlobLink(recordedBlob.blobURL);
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
            const formData = new FormData();
            formData.append('audio', recordBlobLink);
            const response = await axios.post('/api/save-audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Audio saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving audio:', error);
        }
    };

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
