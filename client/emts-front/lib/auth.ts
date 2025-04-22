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
  } catch {
    return true; // treat as expired if there's an error
  }
}
