import Table from '../../components/common/Table'
import getClientMaster from '../../api/clientMaster'
import { useCallback, useEffect, useState } from 'react';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import styles from '../../assets/style/MasterDetail.module.css'

function ClientMaster() {
    const [isloading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const tableHeader = [
        { header: "取引先コード", accessor: 'ClientMaster_ClientCd', width: '120px' },
        { header: "取引先名", accessor: 'ClientMaster_ClientNm', width: '460px' },
    ]

    const fetchClientMaster = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getClientMaster();
            setTableData(data);
        } catch (err) {
            alert(err)
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await fetchClientMaster();
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

export default ClientMaster;