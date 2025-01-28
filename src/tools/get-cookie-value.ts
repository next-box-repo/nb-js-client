export function getCookieValue(name: string): string | null {
    const cookies = Object.fromEntries(
        document.cookie
            .split(';')
            .map((cookie) => cookie.split('='))
            .map(([key, value]) => [
                key.trim(),
                decodeURIComponent(value || ''),
            ]),
    );

    return cookies[name] ?? null;
}
