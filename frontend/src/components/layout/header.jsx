import styles from '../../assets/style/Header.module.css';
import Button from '../common/Button';
import { MdFactory } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


function Header(props) {
    const { funcName } = props;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/logout/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                alert('ログアウト処理に失敗しました。')
            } else {
                navigate('/login');
            }
        } catch (err) {
            alert(err);
        }
    }
    return (
        <header className={styles.header}>
            <Link to="/home" className={styles.iconLink}>
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