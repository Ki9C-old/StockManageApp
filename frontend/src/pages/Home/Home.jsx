import Table from "../../components/common/Table";
import SearchBox from "../../components/common/SearchBox";
import styles from "../../assets/style/Home.module.css";
import Button from "../../components/common/Button";

function Home() {

    const columns = [
        { header: "メッセージ", accessor: "message", width: "450px" },
        { header: "重要", accessor: "important", width: "60px" },
        { header: "期限", accessor: "deadline", width: "100px" }
    ];

    const data = [
        { message: "田中", important: "!", deadline: "2025/01/02" },
        { message: "佐藤", important: "", deadline: "2025/01/02" }
    ];
    const handleSearch = () => {
        console.log("handleSearch")
    }
    const handleClear = () => {
        console.log("clear!")
    }

    return (
        <>
            <div className={styles.SearchArea}>
                <div className={styles.SearchBox}>
                    <SearchBox placeholder="メッセージ" />
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
                <Table columns={columns} data={data} />
            </div>
        </>
    )

}
export default Home;
