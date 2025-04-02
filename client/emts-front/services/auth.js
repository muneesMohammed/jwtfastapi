import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/token`, new URLSearchParams({
            username,
            password
        }), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        localStorage.setItem("token", response.data.access_token);
        return response.data;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
    }
};

export const getProtectedData = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_URL}/protected`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Access denied:", error.response?.data || error.message);
        throw error;
    }
};
