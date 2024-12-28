export class HttpErrorResponse implements Error {
    readonly name: string = 'HttpErrorResponse';
    readonly message: string;
    readonly error: any | null;
    readonly status: number;
    readonly statusText: string;
    readonly headers: Headers | undefined;
    readonly url: string | undefined;
    readonly ok: boolean = false;

    constructor(init: {
        error?: any;
        status?: number;
        statusText?: string;
        headers?: Headers;
        url?: string;
    }) {
        this.message = init.error
            ? `${init.error.message}`
            : 'HttpErrorResponse';
        this.error = init.error || null;
        this.status = init.status ?? 500;
        this.statusText = init.statusText ?? 'Internal Server Error';
        this.headers = init.headers;
        this.url = init.url;
    }
}
