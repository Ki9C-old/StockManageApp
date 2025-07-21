const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getClientMaster = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/master/client`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (err) {
        throw err;
    }
}

export default getClientMaster;