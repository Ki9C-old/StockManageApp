import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import purchaseRoutes from './routes/purchaseRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// ルーティング
app.use('/api/purchase', purchaseRoutes);

// 起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
