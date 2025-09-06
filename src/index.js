import express from 'express';
import apiRoutes from './api-routes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Posts API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});