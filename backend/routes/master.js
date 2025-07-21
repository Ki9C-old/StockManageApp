import express from 'express';
import { supabase } from '../supabaseClient.js';
const router = express.Router();

router.post('/product', async (req, res) => {

    try {
        let query = supabase
            .from('ProductMasterView')
            .select(
                'ProductMasterView_ProductCd, ProductMasterView_ProductNm, ProductMasterView_TaxTypeId, ProductMasterView_TaxTypeNm, ProductMasterView_TaxRate'
            )
            .order('ProductMasterView_ProductCd', { ascending: true })

        const { data, error } = await query

        if (error) {
            throw error
        }
        res.status(200).json(data);

    } catch (err) {
        return res.status(401).json(e.toString());
    }
});

router.post('/client', async (req, res) => {

    try {
        let query = supabase
            .from('ClientMaster')
            .select(
                'ClientMaster_ClientCd, ClientMaster_ClientNm'
            )
            .order('ClientMaster_ClientCd', { ascending: true })

        const { data, error } = await query

        if (error) {
            throw error
        }
        res.status(200).json(data);

    } catch (err) {
        return res.status(401).json(e.toString());
    }
});

router.post('/tax', async (req, res) => {

    try {
        let query = supabase
            .from('TaxMaster')
            .select(
                'TaxMaster_TaxTypeId, TaxMaster_TaxRate, TaxMaster_TaxTypeNm'
            )
            .order('TaxMaster_TaxTypeId', { ascending: true })
        const { data, error } = await query

        if (error) {
            throw error
        }
        res.status(200).json(data);

    } catch (err) {
        return res.status(401).json(e.toString());
    }
});


export default router;