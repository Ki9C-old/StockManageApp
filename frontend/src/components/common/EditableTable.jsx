import Styles from "../../assets/style/Table.module.css";

function EditableTable({ columns, data, onChange }) {
    const isReadOnly = !onChange;

    return (
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
                            <td key={colIdx} style={{ width: col.width }}>
                                {col.editable && !isReadOnly ? (
                                    <input
                                        className={Styles.input}
                                        type="text"
                                        value={String(row[col.accessor] || '')}
                                        onChange={(e) =>
                                            onChange(rowIdx, col.accessor, e.target.value)
                                        }
                                    />
                                ) : (
                                    <span className={Styles.text}>{row[col.accessor]}</span>
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default EditableTable;
