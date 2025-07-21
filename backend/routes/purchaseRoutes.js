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
            .order('PurchaseView_Id', { ascending: false })
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
        res.status(200).json(data);
    } catch (e) {
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
router.post('/insert', async (req, res) => {
    const { header, details } = req.body;
    console.log(req)
    // let calculatedTotalAmount = 0
    // let calculatedTotalAmountWithTax = 0

    if (!header || !details || details.length === 0) {
        return res.status(400).json({ error: 'headerまたはdetailsが不足しています。' });
    }
    if (!header.SupplierNm || !header.PurchasedDate) { //必須項目チェック
        return res.status(400).json({ error: '必須項目が不足しています。(SupplierNm, PurchasedDate)' });
    }
    for (const detail of details) {
        if (!detail.ProductNm || !detail.Quantity || !detail.Amount) {
            return res.status(400).json({ error: '明細の必須項目が不足しています。(ProductNm, Quantity, Amount)' });
        }
        // QuantityとAmountが数値であることの確認
        if (isNaN(Number(detail.Quantity)) || isNaN(Number(detail.Amount))) {
            return res.status(400).json({ error: '数量または単価が不正な値です。' });
        }
    }

    try {
        const { data: purchaseData, error: purchaseError } = await supabase
            .from('Purchase')
            .insert([
                {
                    Purchase_SupplierCd: header.SupplierCd,
                    Purchase_TotalAmount: header.TotalAmount,
                    Purchase_TotalAmountWithTax: header.TotalAmountWithTax,
                    Purchase_PurchasedDate: header.PurchasedDate,
                    Purchase_DeadlineDate: header.DeadlineDate,
                    Purchase_StatusCd: '0',
                    Purchase_Note: header.Note,
                }
            ])
            .select('Purchase_Id') // 挿入後に生成されたIDを返すように指定
            .single(); // 1つのレコードのみ挿入するので.single()を使用

        if (purchaseError) {
            console.error('発注ヘッダー挿入エラー:', purchaseError);
            throw new Error('発注ヘッダーの登録に失敗しました。' + purchaseError.message);
        }
        const newPurchaseId = purchaseData.Purchase_Id;

        const purchaseItemsToInsert = details.map((detail, index) => ({
            PurchaseItem_Id: newPurchaseId, // ヘッダーで生成されたIDを使用
            PurchaseItem_DetailNo: (index + 1), // 明細番号を自動採番
            PurchaseItem_ProductCd: detail.ProductCd,
            PurchaseItem_Quantity: Number(detail.Quantity), // 数値に変換
            PurchaseItem_Amount: Number(detail.Amount),     // 数値に変換
            PurchaseItem_TaxTypeId: detail.TaxTypeCd,
        }));

        const { error: purchaseItemsError } = await supabase
            .from('PurchaseItem')
            .insert(purchaseItemsToInsert);

        if (purchaseItemsError) {
            console.error('発注明細挿入エラー:', purchaseItemsError);
            await supabase.from('Purchase').delete().eq('Purchase_Id', newPurchaseId);
            throw new Error('発注明細の登録に失敗しました。' + purchaseItemsError.message);
        }
        res.status(201).json({ message: '登録が完了しました。', newId: newPurchaseId });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Insert failed' });
    }

});


router.put('/update', async (req, res) => {
    const { header, details } = req.body; // フロントエンドから送られるデータ構造に合わせて分割

    // 1. バリデーション
    if (!header || !header.Id || !details) {
        return res.status(400).json({ error: '更新に必要な情報が不足しています。(Id, header, details)' });
    }
    // TODO: 他のバリデーション (必須項目、型、範囲など)

    let calculatedTotalAmount = 0;
    let calculatedTotalAmountWithTax = 0;
    for (const detail of details) {
        const quantity = Number(detail.Quantity);
        const amount = Number(detail.Amount);
        const taxRate = Number(detail.TaxRate || 0);

        const detailAmount = quantity * amount;
        calculatedTotalAmount += detailAmount;
        calculatedTotalAmountWithTax += detailAmount * (1 + taxRate / 100);
    }

    try {
        // ヘッダーの更新
        const { error: headerUpdateError } = await supabase
            .from('Purchase') // テーブル名
            .update({
                Purchase_SupplierCd: header.SupplierCd,
                Purchase_TotalAmount: calculatedTotalAmount,
                Purchase_TotalAmountWithTax: calculatedTotalAmountWithTax,
                Purchase_PurchasedDate: header.PurchasedDate,
                Purchase_DeadlineDate: header.DeadlineDate,
                Purchase_StatusCd: header.Purchase_StatusCd,
                Purchase_Note: header.Note,
            })
            .eq('Purchase_Id', header.Id); // 更新対象のレコードを指定

        if (headerUpdateError) {
            console.error('発注ヘッダー更新エラー:', headerUpdateError);
            throw new Error('発注ヘッダーの更新に失敗しました。' + headerUpdateError.message);
        }

        // 明細の更新（既存の明細を一旦削除し、新しい明細を全て挿入する
        const { error: deleteDetailsError } = await supabase
            .from('PurchaseItem')
            .delete()
            .eq('PurchaseItem_Id', header.Id);

        if (deleteDetailsError) {
            console.error('既存明細削除エラー:', deleteDetailsError);
            throw new Error('既存明細の削除に失敗しました。' + deleteDetailsError.message);
        }

        // 新しい明細の挿入
        const purchaseItemsToInsert = details.map((detail, index) => ({
            PurchaseItem_Id: header.Id,
            PurchaseItem_DetailNo: (index + 1),
            PurchaseItem_ProductCd: detail.ProductCd,
            PurchaseItem_Quantity: Number(detail.Quantity),
            PurchaseItem_Amount: Number(detail.Amount),
            PurchaseItem_TaxTypeId: detail.TaxTypeCd,
        }));

        const { error: insertNewDetailsError } = await supabase
            .from('PurchaseItem')
            .insert(purchaseItemsToInsert);

        if (insertNewDetailsError) {
            console.error('新規明細挿入エラー:', insertNewDetailsError);
            // TODO: この場合、ヘッダーは更新済みで明細が空になってしまう
            throw new Error('新しい明細の登録に失敗しました。' + insertNewDetailsError.message);
        }

        res.status(200).json({ message: '発注情報が更新されました。' });

    } catch (e) {
        console.error("更新エラー:", e);
        res.status(500).json({ error: true, message: 'サーバー内部エラーが発生しました。', details: e.message });
    }
});



router.post('/delete', async (req, res) => {
    const { PurchaseId } = req.body;

    if (!PurchaseId) {
        return res.status(400).json({ error: '削除対象の発注IDが指定されていません。' });
    }

    try {
        const { error: deleteItemsError } = await supabase
            .from('PurchaseItem')
            .delete()
            .eq('PurchaseItem_Id', PurchaseId);

        if (deleteItemsError) {
            console.error('発注明細削除エラー:', deleteItemsError);
            throw new Error('発注明細の削除に失敗しました。' + deleteItemsError.message);
        }

        // ヘッダーを削除
        const { error: deleteHeaderError } = await supabase
            .from('Purchase') // テーブル名
            .delete()
            .eq('Purchase_Id', PurchaseId);

        if (deleteHeaderError) {
            console.error('発注ヘッダー削除エラー:', deleteHeaderError);
            throw new Error('発注ヘッダーの削除に失敗しました。' + deleteHeaderError.message);
        }

        res.status(200).json({ message: '発注情報が削除されました。' });

    } catch (e) {
        console.error("削除エラー:", e);
        res.status(500).json({ error: true, message: 'サーバー内部エラーが発生しました。', details: e.message });
    }
});


router.post('/fill-master', async (req, res) => {
    const { supplierCd, productCds } = req.body; // supplierCdは単一、productCdsは配列

    const results = {
        supplierMaster: null,
        productMasters: []
    };

    try {
        if (supplierCd) {
            const { data: supplierData, error: supplierError } = await supabase
                .from('ClientMaster')
                .select('ClientMaster_ClientNm')
                .eq('ClientMaster_ClientCd', supplierCd)
                .single();

            // PGRST116は「見つからない」エラーなので、それ以外の場合のみエラーとして処理
            if (supplierError && supplierError.code !== '22P02') {
                console.error('サプライヤーマスタ検索エラー:', supplierError);
                throw new Error('サプライヤーマスタの検索に失敗しました。' + supplierError.message);
            }
            results.supplierMaster = supplierData;
        }

        // 2. 商品マスタと税率マスタの検索（複数の商品コードに対応）
        // productCdsが空でない場合のみ検索を実行
        if (productCds && productCds.length > 0) {
            const uniqueProductCds = [...new Set(productCds)]; // 重複を排除

            const { data: productData, error: productError } = await supabase
                .from('ProductMaster')
                .select(`
                    ProductMaster_ProductCd,
                    ProductMaster_ProductNm,
                    ProductMaster_TaxTypeId,
                    TaxMaster(
                        TaxMaster_TaxTypeNm,
                        TaxMaster_TaxRate
                    )
                `)
                .in('ProductMaster_ProductCd', uniqueProductCds); // 複数の商品コードで検索

            if (productError) {
                console.error('商品マスタ検索エラー:', productError);
                throw new Error('商品マスタの検索に失敗しました。' + productError.message);
            }

            if (productData) {
                results.productMasters = productData.map(item => ({
                    ProductMaster_ProductCd: item.ProductMaster_ProductCd,
                    ProductMaster_ProductNm: item.ProductMaster_ProductNm,
                    ProductMaster_TaxTypeId: item.ProductMaster_TaxTypeId,
                    ProductMaster_TaxTypeNm: item.TaxMaster ? item.TaxMaster.TaxMaster_TaxTypeNm : null,
                    ProductMaster_TaxRate: item.TaxMaster ? item.TaxMaster.TaxMaster_TaxRate : null,
                }));
            }
        }
        console.log(results)
        res.status(200).json(results);

    } catch (e) {
        console.error("全マスタ問合せエラー (fill-all-masters):", e);
        res.status(500).json({ error: true, message: 'サーバー内部エラーが発生しました。', details: e.message || e.toString() });
    }
});



export default router;