// IN：表形式のデータ配列
// IN：1ページ当たりの表示件数
// IN：現在のページ
// OUT：ページごとに分割されたデータ
// OUT：合計ページ数

import { useMemo } from "react";

function usePagination(data, itemsPerPage, currentPage) {
    const totalPages = useMemo(() => Math.ceil(data.length / itemsPerPage), [data, itemsPerPage]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    }, [data, itemsPerPage, currentPage]);

    return { paginatedData, totalPages };
}

export default usePagination;