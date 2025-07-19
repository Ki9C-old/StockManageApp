const checkAuth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/check`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('ログインしていません');
        }

        const data = await response.json();
        return data.loggedIn;
    } catch (err) {
        return false;
    }
};

export default checkAuth;