const router = express.Router();
import express from 'express';

router.post('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('セッション破棄エラー:', err);
            return res.status(500).json({ message: 'ログアウトに失敗しました' });
        }
        res.clearCookie('connect.sid');
        return res.json({ message: 'ログアウト成功' });
    });
});

export default router;