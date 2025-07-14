import styles from "../../assets/style/SearchBox.module.css"

function SearchBox(props) {
    const { placeholder } = props;
    return (
        <input type="text" placeholder={placeholder} className={styles.searchBox} />
    )
}

export default SearchBox;