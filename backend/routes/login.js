import { supabase } from '../supabaseClient.js';
import express from 'express';
import dotenv from 'dotenv';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



router.post('/login', async (req, res) => {
    const { userId, password } = req.body;

    try {
        const { data, error } = await supabase
            .from('Users')
            .select(
                'Users_Id, Users_LoginId, Users_Password'
            )
            .eq('Users_LoginId', userId)
            .single()

        if (!data) {
            return res.status(401).json({ details: "ユーザーが存在しません。" })
        }

        if (error) {
            console.log(error)
            return res.status(500).json({ details: 'DB取得エラー', error });
        }

        const user = data;

        const isValid = await bcrypt.compare(password, user.Users_Password);
        if (!isValid) {
            return res.status(401).json({ details: 'パスワードが違います' });
        }

        const token = jwt.sign(
            {
                id: user.Users_Id,
                userId: user.Users_LoginId,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });

    } catch (err) {
        return res.status(500).json({ details: 'サーバーエラー' });
    }

});

export default router;