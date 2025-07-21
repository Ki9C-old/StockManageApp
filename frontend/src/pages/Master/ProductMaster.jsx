import Table from '../../components/common/Table'
import getProductMaster from '../../api/productMaster'
import { useCallback, useEffect, useState } from 'react';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import styles from '../../assets/style/MasterDetail.module.css'

function ProductMaster() {
    const [isloading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const tableHeader = [
        { header: "商品コード", accessor: 'ProductMasterView_ProductCd', width: '180px' },
        { header: "商品名", accessor: 'ProductMasterView_ProductNm', width: '480px' },
        { header: "消費税区分", accessor: 'ProductMasterView_TaxTypeId', width: '100px' },
        { header: "消費税区分名", accessor: 'ProductMasterView_TaxTypeNm', width: '180px' },
        { header: "消費税率（%）", accessor: 'ProductMasterView_TaxRate', width: '120px' },
    ]

    const fetchProductMaster = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getProductMaster();
            setTableData(data);
        } catch (err) {
            alert(err)
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await fetchProductMaster();
        };
        fetchData();
    }, []);




    return (
        <>
            {isloading ? (
                <LoadingOverlay />
            ) : (
                <div className={styles.table}>
                    <Table columns={tableHeader} data={tableData} />
                </div>
            )}
        </>
    )
}

export default ProductMaster;