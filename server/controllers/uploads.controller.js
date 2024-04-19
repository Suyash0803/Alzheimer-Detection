import fs from 'fs';

const saveAudio = (req, res) => {
    try {
        const { path } = req.file;
        fs.renameSync(path, `uploads/${req.file.filename}`);
        res.json({ message: 'Audio saved successfully' });
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: "Audio upload failed. Please try again"})
    }
};

export { saveAudio };
