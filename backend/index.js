import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import purchaseRoutes from './routes/purchaseRoutes.js';
import loginRoutes from './routes/login.js';
import logoutRoutes from './routes/logout.js';
import session from 'express-session';
import authRoutes from './routes/auth.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 3600000,
    secure: true,
    sameSite: 'lax'
  },
}));

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


// 起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
