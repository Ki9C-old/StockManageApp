import express from 'express';
import { supabase } from '../supabaseClient.js';
const router = express.Router();

router.post('/search-list', async (req, res) => {
    const conditions = req.body;

    try {
        let query = supabase
            .from('PurchaseView')
            .select(
                `PurchaseView_Id, 
                PurchaseView_ProductNm, 
                PurchaseView_Quantity, 
                PurchaseView_TotalAmountWithTax,
                PurchaseView_PurchasedDate, 
                PurchaseView_DeadlineDate, 
                PurchaseView_ClientNm,
                PurchaseView_Note,
                PurchaseView_StatusCd
                `
            )
            .eq('PurchaseView_StatusCd', 1)
            .order('PurchaseView_Id', { ascending: false })
        //発注番号
        query = query.eq('PurchaseView_StatusCd', 1)

        if (conditions["Id"]) {
            query = query.eq('PurchaseView_Id', conditions["Id"]);
        }

        //商品名
        if (conditions["ProductNm"]) {
            query = query.like('PurchaseView_ProductNm', `%${conditions["ProductNm"]}%`);
        }

        //発注先名
        if (conditions["ClientNm"]) {
            query = query.like('PurchaseView_ClientNm', `%${conditions["ClientNm"]}%`);
        }

        //メモ
        if (conditions["Note"]) {
            query = query.like('PurchaseView_Note', `%${conditions["Note"]}%`);
        }

        const { data, error } = await query;
        if (error) {
            throw error;
        }
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: true, code: e.code || e.toString() });
    }
});


export default router;