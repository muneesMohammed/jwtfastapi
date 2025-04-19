// lib/auth.ts
import { jwtDecode } from "jwt-decode";

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem("token");
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("token");
  }
};

// // Optional: check if token is expired (assuming it's a JWT)
// export const isTokenExpired = (token: string): boolean => {
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     const expiry = payload.exp;
//     return Date.now() >= expiry * 1000;
//   } catch (error) {
//     return true;
//   }
// };

// Optional: helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
};





export function isTokenExpired(token: string): boolean {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    if (!decoded.exp) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true; // treat as expired if there's an error
  }
}

// export function getToken(): string | null {
//   return typeof window !== "undefined" ? localStorage.getItem("token") : null;
// }
