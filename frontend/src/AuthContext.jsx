import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // useLocationをインポート
import checkAuth from './api/checkAuth'; // 認証チェックAPIをインポート

// 認証コンテキストを作成
const AuthContext = createContext(null);

// 認証プロバイダーコンポーネント
// アプリケーションの認証状態を管理し、子コンポーネントに提供します。
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態
    const [loadingAuth, setLoadingAuth] = useState(true); // 認証チェック中かどうか
    const location = useLocation(); // 現在のURL情報を取得

    useEffect(() => {
        // 認証状態を確認する非同期関数
        const verifyAuth = async () => {
            setLoadingAuth(true); // 認証チェックを開始する前にローディングを設定
            try {
                // checkAuth APIを呼び出して、現在のログイン状態を取得
                const loggedIn = await checkAuth();
                setIsLoggedIn(loggedIn); // ログイン状態を更新
            } catch (error) {
                console.error("認証状態の確認中にエラーが発生しました:", error);
                setIsLoggedIn(false); // エラーが発生した場合はログインしていないと判断
            } finally {
                setLoadingAuth(false); // 認証チェックが完了
            }
        };

        verifyAuth();
    }, []);

    return (
        // AuthContext.Providerを通じて、isLoggedInとloadingAuth、そしてsetIsLoggedInを子コンポーネントに提供
        <AuthContext.Provider value={{ isLoggedIn, loadingAuth, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

// AuthContextの値を簡単に利用するためのカスタムフック
export const useAuth = () => {
    return useContext(AuthContext);
};

// 保護されたルートコンポーネント
// ログインしていないユーザーをログインページにリダイレクトします。
export const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loadingAuth } = useAuth(); // 認証状態を取得
    const location = useLocation(); // ProtectedRoute内でuseLocationをインポート

    // ログインページにいるが、すでにログインしている場合は/homeへリダイレクト
    // これにより、ログイン後の無限リダイレクトを防ぎ、正しいページへ遷移させる
    if (isLoggedIn && location.pathname === '/login') {
        return <Navigate to="/home" replace />;
    }

    // 認証チェック中で、かつまだログインしていない場合はローディング表示
    if (loadingAuth && !isLoggedIn) {
        return <div>認証情報を確認中...</div>;
    }

    // 認証チェックが完了し、ログインしていない場合はログインページへリダイレクト
    if (!isLoggedIn && !loadingAuth) {
        return <Navigate to="/login" replace />;
    }

    // ログインしている場合は、子コンポーネントをレンダリング
    return children;
};