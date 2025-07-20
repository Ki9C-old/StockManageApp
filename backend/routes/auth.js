import express from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.get('/check', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ loggedIn: false });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ loggedIn: true, user: decoded });
    } catch (err) {
        return res.status(401).json({ loggedIn: false });
    }
});

export default router;