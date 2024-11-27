export function responseJSON(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.indexOf('/json') >= 0) {
        if (response.status >= 200 && response.status < 400) {
            return response.json();
        }
    }

    console.warn('Parse json error');
    return Promise.resolve({});
}
