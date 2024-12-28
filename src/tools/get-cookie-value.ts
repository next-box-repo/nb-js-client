export const getCookieValue = (name: string): string | null => {
    const cookies = document.cookie.split(';');
    const prefix = name + '=';

    for (let cookie of cookies) {
        cookie = cookie.trim();

        if (cookie.startsWith(prefix)) {
            let value = cookie.substring(prefix.length);

            return decodeURIComponent(value);
        }
    }

    return null;
};
