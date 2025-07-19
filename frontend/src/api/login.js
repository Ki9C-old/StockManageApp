const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const login = async (loginData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        throw err;
    }
}

export default login;