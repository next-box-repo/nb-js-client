export function normalizeHeaders(
    headers: Headers | [string, string][] | Record<string, string>,
): Record<string, string> {
    if (headers instanceof Headers) {
        return Object.fromEntries(headers.entries());
    }

    if (Array.isArray(headers)) {
        return Object.fromEntries(headers);
    }

    return headers;
}
