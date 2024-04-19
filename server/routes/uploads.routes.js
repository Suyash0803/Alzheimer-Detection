import express from 'express';
import multer from 'multer';
import { saveAudio } from '../controllers/uploads.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/save-audio', upload.single('audio'), saveAudio);

export default function(app) {
    app.use('/api', router)
};
