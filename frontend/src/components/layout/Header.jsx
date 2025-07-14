import styles from '../../assets/style/Header.module.css';
import Button from '../common/Button';
import { MdFactory } from "react-icons/md";
import { Link } from 'react-router-dom';


function Header(props) {
    const { funcName } = props;
    const handleLogout = () => {
        console.log("ログアウト")
    }
    return (
        <header className={styles.header}>
            <Link to="/" className={styles.iconLink}>
                <MdFactory className={styles.icon} />
            </Link>
            <h1 className={styles.title}>{funcName}</h1>
            <div className={styles.button}>
                <Button
                    onClick={handleLogout}
                    color="red"
                    width="100px"
                    height="40px"
                    fontSize="16px"
                >ログアウト
                </Button>
            </div>
        </header>
    )
}
export default Header;