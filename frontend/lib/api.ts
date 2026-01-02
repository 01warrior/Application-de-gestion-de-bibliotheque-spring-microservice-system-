export const API_BASE = "http://localhost:8080"

export async function apiRequest<T>(endpoint: string, token?: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`

  const headers = new Headers(options.headers)
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Erreur API: ${response.status}`)
  }

  // Handle empty responses (204 No Content) gracefully
  if (response.status === 204) {
    return undefined as unknown as T
  }

  // Some endpoints may return an empty body; parse only when content exists
  const text = await response.text()
  return text ? (JSON.parse(text) as T) : (undefined as unknown as T)
}
