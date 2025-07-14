import styles from "../../assets/style/SidebarItem.module.css";
import { Link } from 'react-router-dom';

function SidebarItem(props) {
    const { icon: Icon, children, to } = props;
    // "会計伝票一覧" だけ専用クラスを付与
    const isReceipt = children === "会計伝票一覧";
    return (
        <Link to={to}>
            <div className={isReceipt ? `${styles.Li} ${styles.Receipt}` : styles.Li}>
                <div className={styles.Item}>
                    {Icon && <Icon className={styles.Icon} />}
                    <span className={styles.Text}>{children}</span>
                </div>
            </div>
        </Link>
    );
}

export default SidebarItem;