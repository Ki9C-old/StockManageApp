import { supabase } from '../supabaseClient.js';
import express from 'express';
import dotenv from 'dotenv';
const router = express.Router();


//発注一覧
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
                PurchaseView_Note`
            )

        //発注番号
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
            query = query.like('NoPurchaseView_Note', `%${conditions["Note"]}%`);
        }

        const { data, error } = await query;
        if (error) {
            throw error;
        }
        console.log(data)
        res.status(200).json(data);
    } catch (e) {
        console.error("エラー発生", e);
        res.status(500).json({ error: true, code: e.code || e.toString() });
    }
});



//発注詳細
router.post('/search-detail', async (req, res) => {
    const conditions = req.body;

    try {
        let query = supabase
            .from('PurchaseView')
            .select(
                `PurchaseView_Id,
                PurchaseView_SupplierCd,
                PurchaseView_ClientNm,
                PurchaseView_TotalAmount,
                PurchaseView_TotalAmountWithTax,
                PurchaseView_StatusCd,
                PurchaseView_PurchasedDate, 
                PurchaseView_DeadlineDate, 
                PurchaseView_Note,
                PurchaseView_DetailNo,
                PurchaseView_ProductCd,
                PurchaseView_ProductNm,
                PurchaseView_Quantity,
                PurchaseView_Amount,
                PurchaseView_TaxTypeId,
                PurchaseView_TaxTypeNm,
                PurchaseView_TaxRate
                `
            )

        //発注番号
        if (conditions["Id"]) {
            query = query.eq('PurchaseView_Id', conditions["Id"]);
        } else {
            throw error
        }

        const { data, error } = await query;
        if (error) {
            throw error;
        }
        console.log(data)
        res.status(200).json(data);
    } catch (e) {
        console.error("エラー発生", e);
        res.status(500).json({ error: true, code: e.code || e.toString() });
    }
});

//新規登録 発注一覧・発注明細INSERT
router.post('/api/test2', async (req, res) => {
    const conditions = req.body; // 

    let baseSql = `INSERT INTO Purchase 
                (Purchase_SupplierCd, Purchase_TotalAmount, Purchase_TotalAmountWithTax, Purchase_PurchasedDate,Purchase_DeadlineDate,Purchase_StatusCd,Purchase_Note)
                VALUES (?, ?, ?, ?, ?, 0, ?);
                INSERT INTO PurchaseItem 
                (PurchaseItem_Id, PurchaseItem_DetailNo, Purchase_TotalAmountWithTax, Purchase_PurchasedDate,Purchase_DeadlineDate,Purchase_StatusCd,Purchase_Note)
                VALUES (?, ?, ?, ?, ?, 0, ?);` ;

    const values = [
        conditions["Purchase_SupplierCd"],
        conditions["Purchase_TotalAmount"],
        conditions["Purchase_TotalAmountWithTax"],
        conditions["Purchase_PurchasedDate"],
        conditions["Purchase_DeadlineDate"],
        conditions["Purchase_Note"],
    ];

    try {
        const [result] = await pool.promise().query(baseSql, values);
        res.json({ message: 'Inserted successfully', insertId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Insert failed' });
    }

});


export default router;