// ToDo
// 登録時、空行があれば詰める
// キャンセル時ルーティング LINKでラップしない
// 各エラーチェック 桁数や行数の上限

// API実装後
// 新規登録時のURLの修正
// 削除機能実装
// マスタ検索

import styles from "../../assets/style/PurchaseDetail.module.css"
import { useParams, Link } from "react-router-dom";
import Button from "../../components/common/Button";
import { useEffect, useState } from "react";
import EditableTable from "../../components/common/EditableTable";


function PurchaseDetail(props) {
    const { mode } = props;         //modeは親コンポーネントから受け取る
    const { id } = useParams();     //発注番号はURLから取得
    const isEdit = mode === "edit";
    const isView = mode === "view";
    const isCreate = mode === "create";

    const [tableData, setTableData] = useState([]);             //tableデータの状態管理
    const [originalData, setOriginalData] = useState(null);     // 編集前データ状態管理

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



    //---------------- DBから表示中のIDの発注情報の取得 ToDo START ----------------//
    const fetchDataById = (id) => {
        // 仮 のちにAPI実装
        const fetched = {
            Id: id,
            SupplierCd: "0294",
            SupplierNm: "株式会社リンゴ",
            TotalAmount: "2980",
            TotalAmountWithTax: "3200",
            PurchasedDate: "2025/02/18",
            DeadlineDate: "2025/02/20",
            Note: "緊急対応",
            Detail: [
                { DetailNo: "0001", ProductCd: "XYXZ", ProductNm: "ポンプ", Quantity: "5", Amount: "180", TaxTypeCd: "1", TaxTypeNm: "消費税" },
                { DetailNo: "0002", ProductCd: "APPLE", ProductNm: "リンゴ", Quantity: "2", Amount: "180", TaxTypeCd: "1", TaxTypeNm: "軽減税率" },
            ]
        };
        return fetched
    };
    //---------------- DBから表示中のIDの発注情報の取得 END ----------------//


    //---------------- 初期表示で実施 START ----------------//
    useEffect(() => {
        if (isView || isEdit) {                 // 表示モードか編集モードなら
            const data = fetchDataById(id);     // DBから取得関数を動かして
            setTableData(data.Detail);          // 状態管理のとこの関数でSET
            setPurchaseData(data);              // TABLE以外も一緒
            setOriginalData(data);              // 編集モードに入ったとき最新のデータを保管
        } else {                                // 新規登録モードなら
            const blankRow = {                  // 空の行を定義
                DetailNo: "0001",
                ProductCd: "",
                ProductNm: "",
                Quantity: "",
                Amount: "",
                TaxTypeCd: "",
                TaxTypeNm: ""
            };
            setTableData([blankRow]);           // 空の行をテーブルに追加
            setPurchaseData({                   // テーブル以外を空に
                Id: "",
                SupplierCd: "",
                SupplierNm: "",
                TotalAmount: "",
                TotalAmountWithTax: "",
                PurchasedDate: "",
                DeadlineDate: "",
                Note: "",
            });
        }
    }, [id, mode]);                  // IDかmodeが変わったときもやるよ
    //---------------- 初期表示で実施 END ----------------//


    //---------------- テーブルのヘッダーの定義 START ----------------//
    const tableColumns = [
        { header: "明細番号", accessor: "DetailNo", width: "80px", editable: false },
        { header: "商品コード", accessor: "ProductCd", width: "200px", editable: true },
        { header: "商品名", accessor: "ProductNm", width: "400px", editable: false },
        { header: "数量", accessor: "Quantity", width: "80px", editable: true },
        { header: "単価", accessor: "Amount", width: "80px", editable: true },
        { header: "消費税区分", accessor: "TaxTypeCd", width: "80px", editable: true },
        { header: "消費税区分名", accessor: "TaxTypeNm", width: "100px", editable: false },
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
            DetailNo: (tableData.length + 1).toString().padStart(4, '0'),
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
                        <div className={styles.inputCell}>
                            <input onChange={(e) => handlePurchaseChange("SupplierCd", e.target.value)} disabled={isView} value={purchaseData?.SupplierCd} />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.labelCell}>発注先名</div>
                        <div className={styles.inputCell}>
                            <input onChange={(e) => handlePurchaseChange("SupplierNm", e.target.value)} disabled={isView} value={purchaseData?.SupplierNm} />
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
                        <Link to={`/purchase/${id}/view`}>
                            <Button onClick={() => {
                                if (originalData) {
                                    setPurchaseData(originalData);
                                    setTableData(originalData.Detail);
                                }
                            }} color="red" width="80px" height="36px" fontSize="13px">キャンセル</Button>
                        </Link>
                    </>
                )}
            </div>
        </>
    );
}

export default PurchaseDetail;
