import express from 'express';
const router = express.Router();

router.get('/check', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ loggedIn: true, user: req.session.user });
    } else {
        return res.status(401).json({ loggedIn: false });
    }
});

export default router;