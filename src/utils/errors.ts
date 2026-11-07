// consoleFetch errors only carry the HTTP status text; the browser API puts the
// actual reason in the (plain text) response body.
export async function getErrorDetail(err: unknown): Promise<string | undefined> {
  const { response, json } = err as { response?: Response; json?: { message?: string } };
  if (json?.message) return json.message;
  if (response && !response.bodyUsed) {
    try {
      const text = (await response.text()).trim();
      if (text) return text;
    } catch {
      // Fall back to the error message below.
    }
  }
  return (err as Error)?.message;
}

// Watch errors are the console's HttpError: the API Status is in json, the HTTP code in response.
export function getErrorStatus(err: unknown): number | undefined {
  const { json, response } = (err ?? {}) as {
    json?: { code?: number };
    response?: { status?: number };
  };
  return json?.code ?? response?.status;
}

export function getErrorMessage(err: unknown): string {
  const { json, message } = (err ?? {}) as { json?: { message?: string }; message?: string };
  const text = json?.message || message || "Unknown error";
  return text.charAt(0).toUpperCase() + text.slice(1);
}
