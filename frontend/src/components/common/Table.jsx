import Styles from "../../assets/style/Table.module.css"

function Table(props) {

    const { columns, data } = props;


    return (
        <>
            <table className={Styles.table}>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} style={{ width: col.width }}>{col.header}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                            {columns.map((col, colIdx) => (
                                <td key={colIdx}>{row[col.accessor]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table >
        </>
    )
}

export default Table;