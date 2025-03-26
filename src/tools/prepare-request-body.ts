export function prepareRequestBody(
    body: unknown,
): XMLHttpRequestBodyInit | Document | null {
    if (!body) return null;

    if (
        body instanceof FormData ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        body instanceof URLSearchParams ||
        body instanceof Document ||
        ArrayBuffer.isView(body)
    ) {
        return body;
    }

    if (typeof body === 'object') return JSON.stringify(body);

    if (typeof body === 'string') return body;

    return null;
}
