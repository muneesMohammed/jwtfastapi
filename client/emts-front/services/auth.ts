// lib/auth.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://jwtfastapi-production.up.railway.app/'; // Your FastAPI backend URL

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/token`, {
      username,
      password,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data.access_token) {
      Cookies.set('token', response.data.access_token, { expires: 1 }); // Expires in 1 day
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  Cookies.remove('token');
};

export const getCurrentUser = async () => {
  const token = Cookies.get('token');
  if (!token) {
    return null;
  }

  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};