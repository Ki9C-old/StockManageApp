// ToDo
// マスタ検索 → マスタ一覧画面に別タブで飛ばす

import styles from "../../assets/style/PurchaseDetail.module.css"
import { useParams, Link } from "react-router-dom";
import Button from "../../components/common/Button";
import { useEffect, useState, useCallback } from "react";
import EditableTable from "../../components/common/EditableTable";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { searchPurchaseDetail, insertPurchase, updatePurchase, deletePurchase, fillMasterData } from "../../api/purchase";

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
    const [validationTrigger, setValidationTrigger] = useState(false);
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


    //------------------------------------------ 初期表示で実施 START ------------------------------------------//
    useEffect(() => {
        setIsLoading(true);
        if (isView || isEdit) {                 // 表示モードか編集モードなら
            if (id) {
                searchPurchaseDetail(id).then(data => {
                    if (!data || data.length === 0) {
                        alert("データが見つかりません。");
                        setPurchaseData({
                            Id: "", SupplierCd: "", SupplierNm: "", TotalAmount: "", TotalAmountWithTax: "",
                            Purchase_StatusCd: "", PurchasedDate: "", DeadlineDate: "", Note: "",
                        });
                        setTableData([]);
                        setOriginalTableData([]);
                        setIsLoading(false);
                        navigate('/purchase');
                        return;
                    }
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

                    // 明細情報
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
                    setPurchaseData(headerData);
                    setOriginalData(headerData);
                    setTableData(detailData);
                    setOriginalTableData(detailData);

                }).catch(err => {
                    alert("データ取得中にエラーが発生しました:", err);
                    setIsLoading(false);
                }).finally(() => {
                    setIsLoading(false);
                })
            } else {
                alert("URLに発注番号が指定されていません。");
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
    }, [id, mode, isView, isEdit, isCreate, navigate]);                  // IDかmodeが変わったときもやるよ
    //------------------------------------------ 初期表示で実施 END ------------------------------------------//


    //------------------------------------------ 金額計算 ------------------------------------------//
    const calculateTotals = () => {
        const subtotal = tableData.reduce((sum, row) => {
            const qty = parseFloat(row.Quantity) || 0;
            const amt = parseFloat(row.Amount) || 0;
            return sum + (qty * amt);
        }, 0);

        const totalWithTax = tableData.reduce((sum, row) => {
            const qty = parseFloat(row.Quantity) || 0;
            const amt = parseFloat(row.Amount) || 0;
            const rate = parseFloat(row.TaxRate) || 0;
            const lineTotal = qty * amt;
            return sum + lineTotal * (1 + rate / 100);
        }, 0);

        setPurchaseData(prev => ({
            ...prev,
            TotalAmount: subtotal.toFixed(0),
            TotalAmountWithTax: totalWithTax.toFixed(0),
        }));
    };
    //------------------------------------------ 金額計算 ------------------------------------------//


    //-----------------------------------------INSERT------------------------------------------// UPDATE
    const handleSubmit = async () => {
        setIsLoading(true);
        calculateTotals();

        try {
            await handleFillMaster(false);
            setValidationTrigger(true);
        } catch (err) {
            alert("マスタ取得中に失敗しました。", err);
            setIsLoading(false); // エラー時はローディングを解除
        }
    }

    useEffect(() => {
        if (validationTrigger) {
            const currentSupplierNm = purchaseData.SupplierNm;
            const cuurentPurchaseDate = purchaseData.PurchasedDate;
            const cuurentDeadline = purchaseData.DeadlineDate;
            const currentTableData = tableData.filter(row =>
                Object.values(row).some(value => value !== "" && value !== null && value !== undefined)                // 空の行を除外
            ).map((row, index) => ({
                ...row,
                DetailNo: (index + 1).toString() // 明細番号を1から振り直す
            }));


            //--------------------------------------- ヘッダー必須 ---------------------------------------//
            let missingFields = [];
            if (!currentSupplierNm) {
                missingFields.push("発注先名");
            }
            if (!cuurentPurchaseDate) {
                missingFields.push("発注日");
            }
            if (!cuurentDeadline) {
                missingFields.push("発注納期");
            }
            if (missingFields.length > 0) {
                alert(`${missingFields.join('、')}が入力されていません。`);
                setIsLoading(false); // エラー時はローディングを解除
                setValidationTrigger(false); // トリガーをリセット
                return;
            }
            //--------------------------------------- ヘッダー必須 ---------------------------------------//


            //--------------------------------------- テーブル項目必須 ---------------------------------------//

            let rowMissingFields = [];
            currentTableData.forEach((row, index) => {
                if (!row.ProductCd) {
                    rowMissingFields.push(" 商品コード ");
                }
                if (!row.Quantity) {
                    rowMissingFields.push(" 数量 ");
                }
                if (!row.Amount) {
                    rowMissingFields.push(" 単価 ");
                }
                if (row.ProductCd && (!row.ProductNm || !row.TaxTypeCd || !row.TaxTypeNm)) {
                    rowMissingFields.push(" 商品マスタ情報 ");
                }
            });

            if (rowMissingFields.length > 0) {
                const errmsg = `${[...new Set(rowMissingFields)]}を入力してください。`
                alert(errmsg);
                setIsLoading(false);
                setValidationTrigger(false);
                return;
            }
            if (currentTableData.length === 0) {
                alert("明細が1行も入力されていません。");
                setIsLoading(false);
                setValidationTrigger(false);
                return;
            }


            let tableErrmsg = [];
            currentTableData.forEach((row, index) => {
                if (row.Quantity && row.Quantity > 99) {
                    tableErrmsg.push("数量は100未満で入力してください。");
                }
                if (row.Amount && row.Amount > 100000) {
                    tableErrmsg.push("単価は1000000未満で入力してください。");
                }
            });

            if (tableErrmsg.length > 0) {
                alert(tableErrmsg);
                setIsLoading(false);
                setValidationTrigger(false);
                return;
            }
            //--------------------------------------- テーブル項目必須 ---------------------------------------//


            const executeSubmission = async () => {
                try {
                    const sendData = {
                        header: {
                            ...(isEdit && { Id: purchaseData.Id }),
                            SupplierCd: purchaseData.SupplierCd,
                            SupplierNm: currentSupplierNm,
                            TotalAmount: purchaseData.TotalAmount,
                            TotalAmountWithTax: purchaseData.TotalAmountWithTax,
                            Purchase_StatusCd: purchaseData.Purchase_StatusCd,
                            PurchasedDate: purchaseData.PurchasedDate,
                            DeadlineDate: purchaseData.DeadlineDate,
                            Note: purchaseData.Note,
                        },
                        details: currentTableData.map(detail => ({
                            DetailNo: detail.DetailNo,
                            ProductCd: detail.ProductCd,
                            ProductNm: detail.ProductNm,
                            Quantity: detail.Quantity,
                            Amount: detail.Amount,
                            TaxTypeCd: detail.TaxTypeCd,
                            TaxRate: detail.TaxRate,
                        })),
                    };

                    let result;
                    if (isCreate) {
                        const newId = await insertPurchase(sendData);
                        if (newId) {
                            navigate(`/purchase/${newId}/view`);
                        } else {
                            alert("新規登録後、発注IDが取得できませんでした。一覧画面へ遷移します。");
                            navigate('/purchase');
                        }
                    } else if (isEdit) {
                        result = await updatePurchase(sendData);
                        alert("更新が完了しました。", result);
                        navigate(`/purchase/${id}/view`);
                    } else {
                        throw new Error("無効なモードです。");
                    }
                } catch (err) {
                    alert("登録処理中にエラーが発生しました:", err);
                } finally {
                    setIsLoading(false); // 処理完了後、ローディングを解除
                    setValidationTrigger(false); // トリガーをリセット
                }
            };
            executeSubmission();
        }
    }, [validationTrigger, purchaseData, tableData, isEdit, isCreate, id, navigate]);
    //-----------------------------------------INSERT------------------------------------------//


    //-----------------------------------------DELETE------------------------------------------//
    const handleDelete = async () => {
        if (!window.confirm("削除してよろしいですか？")) {
            return;
        }
        setIsLoading(true);
        try {
            const deleteId = { PurchaseId: id };
            await deletePurchase(deleteId);
            alert('削除完了しました。')
            navigate('/purchase');
        } catch (err) {
            alert(`削除処理に失敗しました: ${err.message}`);
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }
    //-----------------------------------------DELETE------------------------------------------//


    //------------------------------------------ テーブルのヘッダーの定義 START ------------------------------------------//
    const tableColumns = [
        { header: "明細番号", accessor: "DetailNo", width: "80px", editable: false },
        { header: "商品コード", accessor: "ProductCd", width: "200px", editable: true },
        { header: "商品名", accessor: "ProductNm", width: "400px", editable: false },
        { header: "数量", accessor: "Quantity", width: "80px", editable: true },
        { header: "単価", accessor: "Amount", width: "80px", editable: true },
        { header: "消費税区分", accessor: "TaxTypeCd", width: "80px", editable: false },
        { header: "消費税区分名", accessor: "TaxTypeNm", width: "100px", editable: false },
        { header: "消費税率", accessor: "TaxRate", width: "100px", editable: false },
    ];
    //------------------------------------------ テーブルのヘッダーの定義 END ------------------------------------------//


    //------------------------------------------ TABLEの中身が変わったら START ------------------------------------------//
    const handleTableChange = (rowIdx, accessor, value) => {    // 変わった行のindexそ受けとる
        const updated = [...tableData];                         // いまのデータを取っておいて
        updated[rowIdx][accessor] = value;                      // 受け取った行の受け取った列を上書き
        setTableData(updated);                                  // 状態管理関数に渡す
    };
    //------------------------------------------ TABLEの中身が変わったら END ------------------------------------------//


    //------------------------------------------ 表以外が変わったら START ------------------------------------------//
    const handlePurchaseChange = (field, value) => {
        setPurchaseData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    //------------------------------------------ 表以外が変わったら END ------------------------------------------//


    //------------------------------------------ 行追加 START ------------------------------------------//
    const handleAddRow = () => {

        if (tableData.length >= 10) {
            alert("明細は10行までしか追加できません。");
            return;
        }

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
    //------------------------------------------ 行追加 END ------------------------------------------//


    //------------------------------------------ マスタ問合せ------------------------------------------//
    const handleFillMaster = async (loadingState) => {
        if (loadingState) {
            setIsLoading(true);
        }
        try {
            const supplierCd = purchaseData.SupplierCd;
            const productCds = tableData.map(row => row.ProductCd).filter(Boolean);
            const data = await fillMasterData(supplierCd, productCds);

            if (data.supplierMaster && data.supplierMaster.ClientMaster_ClientNm) {
                setPurchaseData(prev => ({
                    ...prev,
                    SupplierNm: data.supplierMaster.ClientMaster_ClientNm,
                }));
                let supplierFound = true;
            } else {
                setPurchaseData(prev => ({ ...prev, SupplierNm: "" }));
            }

            if (data.productMasters && data.productMasters.length > 0) {
                let productsFoundInQuery = true;
                setTableData(prevTableData => {
                    let newTableData = [...prevTableData];
                    newTableData.forEach((row, idx) => {
                        const masterItem = data.productMasters.find(
                            mi => mi.ProductMaster_ProductCd === Number(String(row.ProductCd).trim())
                        );
                        if (masterItem) {
                            newTableData[idx] = {
                                ...newTableData[idx],
                                ProductNm: masterItem.ProductMaster_ProductNm,
                                TaxTypeCd: masterItem.ProductMaster_TaxTypeId,
                                TaxTypeNm: masterItem.ProductMaster_TaxTypeNm,
                                TaxRate: String(masterItem.ProductMaster_TaxRate)
                            };
                        } else if (row.ProductCd !== "") {
                            newTableData[idx] = {
                                ...newTableData[idx],
                                ProductNm: "",
                                TaxTypeCd: "",
                                TaxTypeNm: "",
                                TaxRate: "",
                            };
                        } else {
                        }
                    });

                    // ここで完全に空の行をフィルタリングし、明細番号を振り直す
                    const filteredAndReindexed = newTableData.filter(row =>
                        Object.keys(row).filter(key => key == 'ProductCd').some(key => row[key] !== "" && row[key] !== null && row[key] !== undefined)
                    ).map((row, index) => ({
                        ...row,
                        DetailNo: (index + 1).toString()
                    }));
                    return filteredAndReindexed;
                });
            } else {
                setTableData(prevTableData => {
                    let newTableData = [...prevTableData];
                    newTableData.forEach((row, idx) => {
                        if (row.ProductCd !== "") {
                            newTableData[idx] = {
                                ...newTableData[idx],
                                ProductNm: "",
                                TaxTypeCd: "",
                                TaxTypeNm: "",
                                TaxRate: "",
                            };
                        }
                    });
                    // ここで完全に空の行をフィルタリングし、明細番号を振り直す
                    const filteredAndReindexed = newTableData.filter(row =>
                        Object.values(row).some(value => value !== "" && value !== null && value !== undefined)
                    ).map((row, index) => ({
                        ...row,
                        DetailNo: (index + 1).toString()
                    }));
                    return filteredAndReindexed;
                });
            }

        } catch (err) {
            alert(`マスタ問合せ中にエラーが発生しました: ${err.message}`);
        } finally {
            if (loadingState) {
                setIsLoading(false);
            }
        }
    };
    //------------------------------------------ マスタ問合せ------------------------------------------//


    //------------------------------------------ マスタ検索 ToDo START ------------------------------------------//
    const handleGetMaster = () => {
    };
    //------------------------------------------ マスタ検索 ToDo END ------------------------------------------//


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
                                <div className={styles.inputCell}>
                                    <input onChange={(e) => handlePurchaseChange("SupplierCd", e.target.value)} value={purchaseData?.SupplierCd} disabled={isView} />
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.labelCell}>発注先名</div>
                                <div className={`${styles.inputCell} ${isView ? "" : styles.disabled}`}>
                                    <input disabled onChange={(e) => handlePurchaseChange("SupplierNm", e.target.value)} value={purchaseData?.SupplierNm} />
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
                                    <input type="date" onChange={(e) => handlePurchaseChange("PurchasedDate", e.target.value)} disabled={isView} value={purchaseData?.PurchasedDate} />
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.labelCell}>発注納期</div>
                                <div className={styles.inputCell}>
                                    <input type="date" onChange={(e) => handlePurchaseChange("DeadlineDate", e.target.value)} disabled={isView} value={purchaseData?.DeadlineDate} />
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
                                <div className={styles.getMaster}>
                                    <Button
                                        onClick={() => handleFillMaster(true)}
                                        color="blue"
                                        width="100px"
                                        height="36px"
                                        fontSize="13px"
                                    >
                                        マスタ問合せ
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
                                <Button onClick={handleDelete} color="red" width="60px" height="36px" fontSize="13px">削除</Button>
                            </>
                        )}
                        {(isEdit || isCreate) && (
                            <>
                                <Button
                                    onClick={handleSubmit}
                                    color="green"
                                    width="60px"
                                    height="36px"
                                    fontSize="13px"
                                >
                                    登録
                                </Button>
                                <Button onClick={() => {
                                    if (originalData) {
                                        setPurchaseData(originalData);
                                        setTableData(originalTableData);
                                    }
                                    if (isCreate) {
                                        navigate('/purchase');
                                    } else {
                                        navigate(`/purchase/${id}/view`);
                                    }
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
