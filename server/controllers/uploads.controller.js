import fs from 'fs';
import { getTranscripts } from '../utils/textconverter.js';

async function generateTranscripts( audioUrl ) {
    try {
        const transcript = await getTranscripts(audioUrl);
        // save transcript as json
        const transcriptJson = JSON.stringify(transcript)
        fs.writeFileSync('./cache/transcript.json', transcriptJson)
        console.log('Trancript file saved successfully')
    } catch (error) {
        console.error(error)
    }
}

function saveAudio(req, res) {
    try {
        const { path } = req.file;
        const newpath = `uploads/${req.file.originalname}`
        fs.renameSync(path, newpath);
        generateTranscripts(newpath);
        
        res.json({ message: 'Audio saved successfully', file: req.file });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Audio upload failed. Please try again" });
    }
}

export { saveAudio };
