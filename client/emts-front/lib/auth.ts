export async function getCurrentUser() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/v1/user/me`, {
      method: "GET",
      credentials: "include",
    });
  
    if (!response.ok) {
      return null;
    }
  
    return response.json();
  }
  