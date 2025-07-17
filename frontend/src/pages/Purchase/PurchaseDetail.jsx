// ToDo
// 登録時、空行があれば詰める
// 株のボタン押下時、Linkの見直し
// 各エラーチェック 桁数や行数の上限
// 新規登録時のURLの修正
// 削除機能実装
// マスタ検索

import styles from "../../assets/style/PurchaseDetail.module.css"
import { useParams, Link } from "react-router-dom";
import Button from "../../components/common/Button";
import { useEffect, useState, useCallback } from "react";
import EditableTable from "../../components/common/EditableTable";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/common/LoadingOverlay";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PurchaseDetail(props) {
    const { mode } = props;         //modeは親コンポーネントから受け取る
    const { id } = useParams();     //発注番号はURLから取得
    const isEdit = mode === "edit";
    const isView = mode === "view";
    const isCreate = mode === "create";
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);           //REACTエラー回避
    const [tableData, setTableData] = useState([]);             //tableデータの状態管理
    const [originalData, setOriginalData] = useState(null);     // 編集前データ状態管理
    const [originalTableData, setOriginalTableData] = useState([]);
    const [purchaseData, setPurchaseData] = useState({
        Id: "",
        SupplierCd: "",
        SupplierNm: "",
        TotalAmount: "",
        TotalAmountWithTax: "",
        PurchasedDate: "",
        DeadlineDate: "",
        Note: "",
    });                                                         //ヘッダー(テーブル以外の情報)



    //---------------- DBから表示中のIDの発注情報の取得START ----------------//
    const fetchDataById = useCallback(async (purchaseId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/purchase/search-detail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Id: purchaseId }), // 発注番号をJSONで送信
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.length > 0) {
                // ヘッダー情報（最初の行から取得）
                const headerData = {
                    Id: String(data[0].PurchaseView_Id || ""),
                    SupplierCd: data[0].PurchaseView_SupplierCd,
                    SupplierNm: data[0].PurchaseView_ClientNm,
                    TotalAmount: String(data[0].PurchaseView_TotalAmount || ""),
                    TotalAmountWithTax: String(data[0].PurchaseView_TotalAmountWithTax || ""),
                    Purchase_StatusCd: data[0].PurchaseView_StatusCd,
                    PurchasedDate: data[0].PurchaseView_PurchasedDate,
                    DeadlineDate: data[0].PurchaseView_DeadlineDate,
                    Note: data[0].PurchaseView_Note,
                };
                setPurchaseData(headerData);
                setOriginalData(headerData);

                // 明細情報（配列の各要素から抽出）
                const detailData = data.map(item => ({
                    DetailNo: String(item.PurchaseView_DetailNo || ""),
                    ProductCd: item.PurchaseView_ProductCd,
                    ProductNm: item.PurchaseView_ProductNm,
                    Quantity: String(item.PurchaseView_Quantity || ""),
                    Amount: String(item.PurchaseView_Amount || ""),
                    TaxTypeCd: item.PurchaseView_TaxTypeId,
                    TaxTypeNm: item.PurchaseView_TaxTypeNm,
                    TaxRate: String(item.PurchaseView_TaxRate || ""),
                }));
                setTableData(detailData);
                setOriginalTableData(detailData);
            } else {
                // データが見つからない場合
                setPurchaseData({
                    Id: "", SupplierCd: "", SupplierNm: "", TotalAmount: "", TotalAmountWithTax: "",
                    Purchase_StatusCd: "", PurchasedDate: "", DeadlineDate: "", Note: "",
                });
                setTableData([]);
                setOriginalTableData([]);
                setIsLoading(false);
            }

        } catch (err) {
            console.error("詳細データエラー:", err);
            alert(`詳細データの取得中にエラーが発生しました: ${err.message}`); // ユーザーに通知
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]);
    //---------------- DBから表示中のIDの発注情報の取得 END ----------------//


    //---------------- 初期表示で実施 START ----------------//
    useEffect(() => {
        if (isView || isEdit) {                 // 表示モードか編集モードなら
            if (id) {
                fetchDataById(id);              // DBから取得関数を動かして
            } else {
                console.warn("URLに発注番号(ID)が指定されていません。");
                setPurchaseData({
                    Id: "", SupplierCd: "", SupplierNm: "", TotalAmount: "", TotalAmountWithTax: "",
                    Purchase_StatusCd: "", PurchasedDate: "", DeadlineDate: "", Note: "",
                });
                setTableData([]);
                setOriginalTableData([]);
                alert('発注番号が見つかりません。');
                navigate('/purchase');
                setIsLoading(false);
            }
        } else {                                // 新規登録モードなら
            const blankRow = {                  // 空の行を定義
                DetailNo: "1",
                ProductCd: "",
                ProductNm: "",
                Quantity: "",
                Amount: "",
                TaxTypeCd: "",
                TaxTypeNm: ""
            };
            setTableData([blankRow]);
            setOriginalTableData([blankRow]);   // 空の行をテーブルに追加
            setPurchaseData({                   // テーブル以外を空に
                Id: "",
                SupplierCd: "",
                SupplierNm: "",
                TotalAmount: "",
                TotalAmountWithTax: "",
                Purchase_StatusCd: "",
                PurchasedDate: "",
                DeadlineDate: "",
                Note: "",
            });
            setIsLoading(false);
        }
    }, [id, mode, isView, isEdit, isCreate, fetchDataById]);                  // IDかmodeが変わったときもやるよ
    //---------------- 初期表示で実施 END ----------------//


    //---------------- テーブルのヘッダーの定義 START ----------------//
    const tableColumns = [
        { header: "明細番号", accessor: "DetailNo", width: "80px", editable: false },
        { header: "商品コード", accessor: "ProductCd", width: "200px", editable: false },
        { header: "商品名", accessor: "ProductNm", width: "400px", editable: true },
        { header: "数量", accessor: "Quantity", width: "80px", editable: true },
        { header: "単価", accessor: "Amount", width: "80px", editable: true },
        { header: "消費税区分", accessor: "TaxTypeCd", width: "80px", editable: false },
        { header: "消費税区分名", accessor: "TaxTypeNm", width: "100px", editable: true },
        { header: "消費税率", accessor: "TaxRate", width: "100px", editable: false },
    ];
    //---------------- テーブルのヘッダーの定義 END ----------------//


    //---------------- TABLEの中身が変わったら START ----------------//
    const handleTableChange = (rowIdx, accessor, value) => {    // 変わった行のindexそ受けとる
        const updated = [...tableData];                         // いまのデータを取っておいて
        updated[rowIdx][accessor] = value;                      // 受け取った行の受け取った列を上書き
        setTableData(updated);                                  // 状態管理関数に渡す
    };
    //---------------- TABLEの中身が変わったら END ----------------//


    //---------------- 表以外が変わったら START ----------------//
    const handlePurchaseChange = (field, value) => {
        setPurchaseData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    //---------------- 表以外が変わったら END ----------------//


    //---------------- 行追加 START ----------------//
    const handleAddRow = () => {
        const newRow = {
            DetailNo: (tableData.length + 1).toString(),
            ProductCd: "",
            ProductNm: "",
            Quantity: "",
            Amount: "",
            TaxTypeCd: "",
            TaxTypeNm: ""
        };
        setTableData([...tableData, newRow]);
    };
    //---------------- 行追加 END ----------------//

    //---------------- マスタ検索 ToDo START ----------------//
    const handleGetMaster = () => {
    };
    //---------------- マスタ検索 ToDo END ----------------//


    return (
        <>
            {isLoading && <LoadingOverlay />}
            {!isLoading && (
                <>
                    <div className={styles.header}>
                        <div className={styles.infoBlock}>
                            <div className={styles.row}>
                                <div className={styles.labelCell}>発注番号</div>
                                <div className={`${styles.inputCell} ${isView ? "" : styles.disabled}`}>
                                    <input disabled value={purchaseData?.Id || ""} />
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.labelCell}>発注先コード</div>
                                <div className={`${styles.inputCell} ${isView ? "" : styles.disabled}`}>
                                    <input disabled onChange={(e) => handlePurchaseChange("SupplierCd", e.target.value)} value={purchaseData?.SupplierCd} />
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.labelCell}>発注先名</div>
                                <div className={styles.inputCell}>
                                    <input onChange={(e) => handlePurchaseChange("SupplierNm", e.target.value)} value={purchaseData?.SupplierNm} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.infoBlock}>
                            <div className={styles.row}>
                                <div className={styles.labelCell}>発注小計額</div>
                                <div className={`${styles.inputCell} ${isView ? "" : styles.disabled}`}>
                                    <input disabled onChange={(e) => handlePurchaseChange("TotalAmount", e.target.value)} value={purchaseData?.TotalAmount} />
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.labelCell}>税込金額</div>
                                <div className={`${styles.inputCell} ${isView ? "" : styles.disabled}`}>
                                    <input disabled onChange={(e) => handlePurchaseChange("TotalAmountWithTax", e.target.value)} value={purchaseData?.TotalAmountWithTax} />
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.labelCell}>ステータス</div>
                                <div className={`${styles.inputCell} ${isView ? "" : styles.disabled}`}>
                                    <input disabled onChange={(e) => handlePurchaseChange("Purchase_StatusCd", e.target.value)} value={purchaseData?.Purchase_StatusCd} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.infoBlock}>
                            <div className={styles.row}>
                                <div className={styles.labelCell}>発注日</div>
                                <div className={styles.inputCell}>
                                    <input onChange={(e) => handlePurchaseChange("PurchasedDate", e.target.value)} disabled={isView} value={purchaseData?.PurchasedDate} />
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.labelCell}>発注納期</div>
                                <div className={styles.inputCell}>
                                    <input onChange={(e) => handlePurchaseChange("DeadlineDate", e.target.value)} disabled={isView} value={purchaseData?.DeadlineDate} />
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.labelCell}>発注メモ</div>
                                <div className={styles.inputCell}>
                                    <input onChange={(e) => handlePurchaseChange("Note", e.target.value)} disabled={isView} value={purchaseData?.Note} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {(isEdit || isCreate) && (
                        <>
                            <div className={styles.addRow}>
                                <Button
                                    onClick={handleAddRow}
                                    color="blue"
                                    width="80px"
                                    height="36px"
                                    fontSize="13px"
                                >
                                    行追加
                                </Button>
                                <div className={styles.getMaster}>
                                    <Button
                                        onClick={handleGetMaster}
                                        color="blue"
                                        width="100px"
                                        height="36px"
                                        fontSize="13px"
                                    >
                                        マスタ検索
                                    </Button>
                                </div>
                            </div>

                            <EditableTable
                                columns={tableColumns}
                                data={tableData}
                                onChange={handleTableChange}
                            />
                        </>
                    )}

                    {isView && (
                        <EditableTable
                            columns={tableColumns}
                            data={tableData}
                        />
                    )}
                    <div className={styles.controlButtons}>
                        {isView && (
                            <>
                                <Link to={`/purchase/${id}/edit`}>
                                    <Button color="green" width="60px" height="36px" fontSize="13px">編集</Button>
                                </Link>
                                <Link to={`/purchase/${id}/edit`}>
                                    <Button color="red" width="60px" height="36px" fontSize="13px">削除</Button>
                                </Link>
                            </>
                        )}
                        {(isEdit || isCreate) && (
                            <>
                                <Link to={`/purchase/${id}/view`}>
                                    <Button color="green" width="60px" height="36px" fontSize="13px">登録</Button>
                                </Link>
                                <Button onClick={() => {
                                    if (originalData) {
                                        setPurchaseData(originalData);
                                        setTableData(originalTableData);
                                    }
                                    navigate(`/purchase/${id}/view`);
                                }} color="red" width="80px" height="36px" fontSize="13px">キャンセル</Button>
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default PurchaseDetail;
