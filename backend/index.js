import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import purchaseRoutes from './routes/purchaseRoutes.js';
import loginRoutes from './routes/login.js';
import logoutRoutes from './routes/logout.js';
import authRoutes from './routes/auth.js'
import masterRoutes from './routes/master.js'
import importRoutes from './routes/importRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.set('trust proxy', 1);

app.use(express.json());

app.use(cors({
  origin: process.env.FRONT_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

// ルーティング
app.use('/api/purchase', purchaseRoutes);
app.use('/api/login', loginRoutes)
app.use('/api/logout', logoutRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/master', masterRoutes);
app.use('/api/import', importRoutes);


// 起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
