import styles from "../../assets/style/Sidebar.module.css"
import SidebarItem from "./SidebarItem";
import { MdInventory, MdLocalShipping, MdAssignment, MdInfo, MdBuild, MdListAlt, MdReceipt, MdStore } from "react-icons/md";


function Sidebar() {
    return (
        <>
            <div className={styles.Sidebar}>
                <div className={styles.Ul}>
                    <SidebarItem icon={MdListAlt} to="/purchase">発注一覧</SidebarItem>
                    <SidebarItem icon={MdInventory} to="/import">入荷一覧</SidebarItem>
                    <SidebarItem icon={MdAssignment} to="/order">受注一覧</SidebarItem>
                    <SidebarItem icon={MdLocalShipping} to="/export">出荷一覧</SidebarItem>
                    <SidebarItem icon={MdStore} to="/stock">在庫一覧</SidebarItem>
                    <SidebarItem icon={MdReceipt} to="/slip">会計伝票一覧</SidebarItem>
                    <SidebarItem icon={MdBuild} to="/master">各種マスタ</SidebarItem>
                </div>
                <div className={styles.Footer}>
                    <SidebarItem icon={MdInfo}>このシステムについて</SidebarItem>
                </div>
            </div>
        </>
    );
}
export default Sidebar;