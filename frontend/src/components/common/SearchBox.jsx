import styles from "../../assets/style/SearchBox.module.css"

function SearchBox(props) {
    const { placeholder, name, value, onChange, type } = props;
    return (
        <input
            placeholder={placeholder}
            className={styles.searchBox}
            name={name}
            value={value}
            onChange={onChange}
            type={type}
        />
    )
}

export default SearchBox;