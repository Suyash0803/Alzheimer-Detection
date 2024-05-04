import express from 'express';
import multer from 'multer';
import { saveAudio } from '../controllers/uploads.controller.js';

const router = express.Router();

// storage options
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
// })

// const storage = multer.memoryStorage()

const upload = multer({ dest: 'uploads/' });


router.post('/assessment-audio', upload.single('audio'), saveAudio);

export default function (app) {
    app.use('/api', router)
};
