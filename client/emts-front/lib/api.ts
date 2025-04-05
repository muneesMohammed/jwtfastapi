export async function login(username: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("grant_type", "password"); // Required for OAuth2
  formData.append("username", username);
  formData.append("password", password);
  formData.append("scope", "");
  formData.append("client_id", "string");
  formData.append("client_secret", "string");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include", // Needed for session cookies
    body: formData.toString(),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  return response.json();
}
