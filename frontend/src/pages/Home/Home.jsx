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
        { message: "デモサイトです。機密性の高いものは登録しないでください", important: "!", deadline: "2026/12/31" },
        { message: "postgreSQL, React, Node.js を利用しています。", important: "", deadline: "2026/01/02" }
    ];
    const handleSearch = () => {
        console.log("handleSearch")
    }
    const handleClear = () => {
        console.log("clear!")
    }

    return (
        <>
            <div className={styles.Table}>
                <Table columns={columns} data={data} />
            </div>
        </>
    )

}
export default Home;
