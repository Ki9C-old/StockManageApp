import Table from "../../components/common/Table";
import SearchBox from "../../components/common/SearchBox";
import styles from "../../assets/style/PurchaseList.module.css";
import Button from "../../components/common/Button";
import { FaCircleInfo } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import usePagination from "../../hooks/usePagination"
import Pagination from "../../components/common/Pagenation"
import LoadingOverlay from "../../components/common/LoadingOverlay";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


function ImportList() {

    //--------------状態管理--------------//
    const [purchaseData, setPurchaseData] = useState([]);       //発注データ
    const [isloading, setLoading] = useState(false);              //ローディング状況
    const [error, setError] = useState(null);                   //エラー状況
    const [searchConditions, setSearchConditions] = useState({  //検索条件
        Id: '',
        ProductNm: '',
        ClientNm: '',
        Note: '',
    });
    //--------------状態管理-------------//


    //--------------API呼び出し-------------//
    const fetchPurchaseList = useCallback(async (conditions = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/import/search-list`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(conditions),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const formattedData = data.map(item => ({
                Id: item.PurchaseView_Id,
                ProductNm: item.PurchaseView_ProductNm,
                Quantity: item.PurchaseView_Quantity,
                TotalAmountWithTax: item.PurchaseView_TotalAmountWithTax,
                PurchasedDate: item.PurchaseView_PurchasedDate,
                DeadlineDate: item.PurchaseView_DeadlineDate,
                SupplierNm: item.PurchaseView_ClientNm,
                Note: item.PurchaseView_Note,
                // 詳細アイコン
                detail: (
                    <Link to={`/import/0000/view`}>
                        <FaCircleInfo className={styles.detailIcon} />
                    </Link>
                ),
            }));
            setPurchaseData(formattedData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);
    //--------------API呼び出し-------------//


    //-------------初期表示--------------//
    useEffect(() => {
        fetchPurchaseList({});
    }, [fetchPurchaseList]);        //useEffect内で呼び出す関数は依存配列に入れる必要あり callbackされているので初回しか呼ばれないはず
    //-------------初期表示--------------//


    //-------------検索ボタンクリック時--------------//
    const handleSearch = () => {
        const idValue = searchConditions.Id;
        if (idValue && !/^\d+$/.test(idValue)) {                // idValueが存在し、かつ数字以外が含まれている場合
            alert("発注番号は半角数字のみで入力してください。");    // エラー
            return;                                             // 検索中断
        }
        fetchPurchaseList(searchConditions);                    //API呼び出し関数 呼び出し 検索条件を引数 
    };
    //-------------検索ボタンクリック時--------------//


    //-------------検索条件変更時--------------//
    const handleSearchInputChange = (e) => {
        const { name, value } = e.target;
        setSearchConditions(prev => {
            const newState = { ...prev, [name]: value };
            return newState;
        });
    };
    //-------------検索条件変更時--------------//



    //--------------クリアボタン--------------//
    const handleClear = () => {
        setSearchConditions({
            Id: '',
            ProductNm: '',
            ClientNm: '',
            Note: '',
        });
        fetchPurchaseList({});
    };
    //--------------クリアボタン--------------//


    //--------------テーブルページ分け--------------//
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 16;

    const {
        paginatedData,
        totalPages
    } = usePagination(purchaseData, ITEMS_PER_PAGE, currentPage);
    //--------------テーブルページ分け--------------//


    //--------------テーブルヘッダー定義--------------//
    const columns = [
        { header: "詳細", accessor: "detail", width: "60px" },
        { header: "発注番号", accessor: "Id", width: "80px" },
        { header: "商品名", accessor: "ProductNm", width: "320px" },
        { header: "数量", accessor: "Quantity", width: "80px" },
        { header: "税込金額（円）", accessor: "TotalAmountWithTax", width: "120px" },
        { header: "発注日", accessor: "PurchasedDate", width: "100px" },
        { header: "納期", accessor: "DeadlineDate", width: "100px" },
        { header: "発注先", accessor: "SupplierNm", width: "280px" },
        { header: "発注メモ", accessor: "Note", width: "320px" },
    ];
    //--------------テーブルヘッダー定義--------------//



    return (
        <>
            {isloading && <LoadingOverlay />}
            {!isloading && (
                <>
                    <div className={styles.SearchArea}>
                        <div className={styles.SearchBox} >
                            <SearchBox placeholder="発注番号" onChange={handleSearchInputChange} name="Id" value={searchConditions.Id} type="text" />
                        </div>
                        <div className={styles.SearchBox} >
                            <SearchBox placeholder="商品名" onChange={handleSearchInputChange} name="ProductNm" value={searchConditions.ProductNm} type="text" />
                        </div>
                        <div className={styles.SearchBox} >
                            <SearchBox placeholder="発注先" onChange={handleSearchInputChange} name="ClientNm" value={searchConditions.ClientNm} type="text" />
                        </div>
                        <div className={styles.SearchBox} >
                            <SearchBox placeholder="メモ" onChange={handleSearchInputChange} name="Note" value={searchConditions.Note} type="text" />
                        </div>
                        <div>
                            <Button
                                onClick={handleSearch}
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
                                onClick={handleClear}
                                color="blue"
                                width="64px"
                                height="40px"
                                fontSize="16px"
                            >
                                クリア
                            </Button>
                        </div>
                    </div>
                    <div className={styles.Table}>
                        <Table columns={columns} data={paginatedData} />
                    </div>
                    <div className={styles.pagination}>
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                </>
            )}
        </>

    )

}
export default ImportList;