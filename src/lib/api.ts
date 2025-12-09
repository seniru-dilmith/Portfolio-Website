/**
 * A custom fetch wrapper to handle automatic token refreshing.
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // First, try the request as is
  let response = await fetch(url, options);

  // If the response is a 401, it might be an expired access token.
  // We'll try to refresh it.
  if (response.status === 401) {
    console.log("Access token expired. Attempting to refresh...");

    // Call your refresh token endpoint
    const refreshResponse = await fetch("/api/admin/refresh", {
      method: "GET",
    });

    if (refreshResponse.ok) {
      console.log("Token refreshed successfully. Retrying original request...");
      // If the token was refreshed successfully, retry the original request.
      // The browser will automatically use the new 'accessToken' cookie.
      response = await fetch(url, options);
    } else {
      console.log("Failed to refresh token. Logging out.");
      // If the refresh token is also invalid, we just return the failed response.
      // Automatic redirection is removed to allow public pages to stay visible.
      return refreshResponse;
    }
  }

  return response;
}