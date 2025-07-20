import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingOverlay from './common/LoadingOverlay';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const checkLogin = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoggedIn(false);
                setLoading(false);
                return;
            }

            try {
                const responce = await fetch(`${API_BASE_URL}/auth/check`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const data = await responce.json();
                setLoggedIn(data.loggedIn);

            } catch (err) {
                setLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };
        checkLogin();
    }, []);

    if (loading) return <LoadingOverlay />;

    if (!loggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;