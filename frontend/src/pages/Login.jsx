import React, { useState } from 'react'
import styles from '../assets/style/Login.module.css';
import SearchBox from '../components/common/SearchBox';
import Button from '../components/common/Button';
import LoadingOverlay from '../components/common/LoadingOverlay'
import login from '../api/login'
import { useNavigate } from 'react-router-dom';
import checkAuth from '../api/checkAuth';
import { useAuth } from '../AuthContext';
import { MdFactory } from "react-icons/md";

function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAuth();

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }


    const handleLogin = async () => {
        setIsLoading(true);
        if (!userId || !password) {
            alert('ユーザーIDとパスワードを入力してください');
            setIsLoading(false);
            return;
        }

        const loginData = {
            userId: userId,
            password: password
        }

        try {
            await login(loginData);
            setIsLoggedIn(true);
            navigate('/home');
        } catch (err) {
            alert(err);
        }

        setIsLoading(false);
    }



    return (
        <>
            {isLoading && <LoadingOverlay />}
            {!isLoading && (
                <>
                    <div className={styles.header}>
                        <MdFactory className={styles.icon} />
                        <h1 className={styles.title}>ログイン</h1>
                    </div>
                    <div className={styles.form}>
                        <div className={styles.userId}>
                            <SearchBox placeholder="ユーザーID" name="userId" value={userId} onChange={handleUserIdChange} type="text" />
                        </div>
                        <div className={styles.password}>
                            <SearchBox placeholder="パスワード" name="password" value={password} onChange={handlePasswordChange} type="password" />
                        </div>

                        <div className={styles.loginButton}>

                            <Button
                                onClick={handleLogin}
                                color="green"
                                width="80px"
                                height="36px"
                                fontSize="13px"
                            >
                                ログイン
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Login;