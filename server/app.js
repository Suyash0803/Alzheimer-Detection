/* eslint-disable no-unused-vars */
import { config as dotenvConfig} from 'dotenv';
import express from 'express';
import cors from 'cors';
import audioRoutes from './routes/uploads.routes.js';

dotenvConfig();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function connectDB() {}

// mount routes
audioRoutes(app)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
