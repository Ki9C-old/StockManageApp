import Table from "../../components/common/Table";
import SearchBox from "../../components/common/SearchBox";
import styles from "../../assets/style/PurchaseList.module.css";
import Button from "../../components/common/Button";
import { FaCircleInfo } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useState } from "react";
import usePagination from "../../hooks/usePagination"
import Pagination from "../../components/common/Pagenation"

function getPurchaseList() {
    const rawData = [
        { Id: '0001', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0002', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0003', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0004', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0005', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0006', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0007', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0008', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0009', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0010', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0011', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0012', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0013', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0014', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0015', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0016', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0017', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0018', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0019', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0020', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0021', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0022', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0023', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0024', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0025', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0026', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
        { Id: '0027', ProductNm: 'パイプ', Quantity: '3', TotalAmountWithTax: '143,200', PurchasedDate: '2025/04/23', DeadlineDate: '2025/04/29', SupplierNm: '株式会社取引先', Note: 'ジャンク品' },
    ];
    return rawData
}

function PurchaseList() {

    const rawData = getPurchaseList();
    const data = rawData.map((row) => ({
        ...row,
        detail: (
            <Link to={`/purchase/${row.Id}/view`}>
                <FaCircleInfo className={styles.detailIcon} />
            </Link>
        ),
    }));

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 16;

    const {
        paginatedData,
        totalPages
    } = usePagination(data, ITEMS_PER_PAGE, currentPage);

    const columns = [
        { header: "詳細", accessor: "detail", width: "60px" },
        { header: "発注番号", accessor: "Id", width: "80px" },
        { header: "商品名", accessor: "ProductNm", width: "320px" },
        { header: "数量", accessor: "Quantity", width: "80px" },
        { header: "税込金額（円）", accessor: "TotalAmountWithTax", width: "120px" },
        { header: "発注日", accessor: "PurchasedDate", width: "100px" },
        { header: "納期", accessor: "DeadlineDate", width: "100px" },
        { header: "発注先", accessor: "SupplierNm", width: "180px" },
        { header: "発注メモ", accessor: "Note", width: "520px" },
    ];



    return (
        <>
            <div className={styles.SearchArea}>
                <div className={styles.SearchBox}>
                    <SearchBox placeholder="発注番号" />
                </div>
                <div className={styles.SearchBox}>
                    <SearchBox placeholder="商品名" />
                </div>
                <div className={styles.SearchBox}>
                    <SearchBox placeholder="発注先" />
                </div>
                <div className={styles.SearchBox}>
                    <SearchBox placeholder="メモ" />
                </div>
                <div>
                    <Button
                        onClick=""
                        color="blue"
                        width="64px"
                        height="40px"
                        fontSize="16px"
                    >
                        検索
                    </Button>
                </div>
                <div>
                    <Button
                        onClick=""
                        color="blue"
                        width="64px"
                        height="40px"
                        fontSize="16px"
                    >
                        クリア
                    </Button>
                </div>
                <div>
                    <Link to="/purchase/create">
                        <Button
                            onClick=""
                            color="green"
                            width="80px"
                            height="40px"
                            fontSize="16px"
                        >
                            新規登録
                        </Button>
                    </Link>
                </div>
            </div>
            <div className={styles.Table}>
                <Table columns={columns} data={paginatedData} />
            </div>
            <div className={styles.pagination}>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>

        </>

    )

}
export default PurchaseList;