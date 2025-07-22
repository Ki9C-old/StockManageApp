const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const searchPurchaseDetail = async (purchaseId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/purchase/search-detail`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Id: purchaseId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`発注データ取得エラー: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.length > 0) {
            return data;
        }
        return null; // データが見つからない場合
    } catch (err) {
        throw err;
    }
};

export const insertPurchase = async (data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/purchase/insert`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`発注登録エラー: ${response.status}`);
        }

        const result = await response.json();
        const newId = result.newId
        return newId;
    } catch (err) {
        throw err;
    }
};

export const updatePurchase = async (data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/purchase/update`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`発注更新エラー: ${response.status}`);
        }
    } catch (err) {
        throw err;
    }
};

export const deletePurchase = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/purchase/delete`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(id),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`発注削除エラー: ${response.status}`);
        }
    } catch (err) {
        throw err;
    }
};

export const fillMasterData = async (supplierCd, productCds) => {
    const response = await fetch(`${API_BASE_URL}/purchase/fill-master`, {
        method: "POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supplierCd, productCds }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`マスタ問合せエラー: ${response.status}`);
    }

    const data = await response.json();
    return data;
};

export const importPurchase = async (purchaseId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/purchase/import`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ purchaseId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`入荷登録エラー: ${response.status}`);
        }
    } catch (err) {
        throw err;
    }
};