import styles from "../../assets/style/Pagination.module.css"

function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className={styles.pagination}>
            <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>前へ</button>
            <span>{currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>次へ</button>
        </div>
    );
}
export default Pagination;