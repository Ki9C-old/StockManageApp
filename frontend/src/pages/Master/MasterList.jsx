import Table from "../../components/common/Table";
import styles from '../../assets/style/MasterList.module.css'

function MasterList() {
    const columns = [
        { header: 'マスタ名', accessor: 'masterName', width: '320px' },
        { header: '概要', accessor: 'explain', width: '520px' }
    ]

    const data = [
        { masterName: "商品マスタ", explain: '商品の名称、商品コードの一覧', path: "product" },
        { masterName: "取引先マスタ", explain: '発注先、受注先の取引先コードの一覧', path: "client" },
        { masterName: "消費税マスタ", explain: '消費税の区分名、消費税率の一覧', path: "tax" }
    ]


    return (
        <div className={styles.masterTable}>
            <Table columns={columns} data={data} />
        </div>
    )
}

export default MasterList;