import Header from "./header";
import Sidebar from "./Sidebar";
import { Outlet, useLocation, matchPath, useNavigate } from 'react-router-dom';


function Layout() {
    const location = useLocation();
    const path = location.pathname;
    const navigate = useNavigate();

    const pathToFuncName = [
        //Login
        { pattern: '/login', name: 'ログイン' },

        //HOME
        { pattern: '/', name: 'トップページ' },
        { pattern: '/home', name: 'トップページ' },

        //発注系機能
        { pattern: '/purchase/create', name: '発注登録' },
        { pattern: '/purchase/:id/view', name: '発注詳細' },
        { pattern: '/purchase/:id/edit', name: '発注詳細' },
        { pattern: '/purchase', name: '発注一覧' },

        //入荷系機能
        { pattern: '/import/create', name: '入荷登録' },
        { pattern: '/import/:id', name: '入荷詳細' },
        { pattern: '/import', name: '入荷一覧' },

        //受注系機能
        { pattern: '/order/create', name: '受注登録' },
        { pattern: '/order/:id', name: '受注詳細' },
        { pattern: '/order', name: '受注一覧' },

        //出荷系機能
        { pattern: '/export/create', name: '出荷登録' },
        { pattern: '/export/:id', name: '出荷詳細' },
        { pattern: '/export', name: '出荷一覧' },

        //出荷系機能
        { pattern: '/stock/:id', name: '在庫詳細' },
        { pattern: '/stock', name: '在庫一覧' },

        //会計伝票系機能
        { pattern: '/slip/create', name: '会計伝票登録' },
        { pattern: '/slip/:id', name: '会計伝票詳細' },
        { pattern: '/slip', name: '会計伝票一覧' },

        //マスタ系機能
        { pattern: '/master', name: '各種マスタ' },
    ];

    const match = pathToFuncName.find(({ pattern }) => matchPath(pattern, path));
    const funcName = match?.name || '機能未定義';
    const isLogin = match?.pattern == '/login'

    return (
        <>
            {!isLogin ?
                <>
                    <Header funcName={funcName} />
                    <Sidebar />
                    <div style={{ marginLeft: '12%', marginTop: '80px' }}>
                        <Outlet />
                    </div>
                </>
                :
                <>
                    <Header funcName={funcName} />
                    <div style={{ marginLeft: '12%', marginTop: '80px' }}>
                        <Outlet />
                    </div>
                </>
            }
        </>
    );
}

export default Layout;
