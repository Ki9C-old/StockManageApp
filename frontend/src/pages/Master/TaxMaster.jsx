import Table from '../../components/common/Table'
import getTaxMaster from '../../api/taxmaster'
import { useCallback, useEffect, useState } from 'react';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import styles from '../../assets/style/MasterDetail.module.css'

function TaxMaster() {
    const [isloading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const tableHeader = [
        { header: "消費税区分", accessor: 'TaxMaster_TaxTypeId', width: '100px' },
        { header: "消費税区分名", accessor: 'TaxMaster_TaxTypeNm', width: '320px' },
        { header: "消費税率（%）", accessor: 'TaxMaster_TaxRate', width: '140px' },

    ]

    const fetchTaxMaster = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTaxMaster();
            setTableData(data);
        } catch (err) {
            alert(err)
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await fetchTaxMaster();
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

export default TaxMaster;