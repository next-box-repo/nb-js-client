import { NbClientParams, NbRequestParams } from './types/base';
import { UserService } from './services/user.service';
import { responseJSON, sendRequest } from './helpers';

export class Client {
    params!: NbClientParams;
    state!: NbRequestParams;

    User!: UserService;

    constructor(params: NbClientParams) {
        this.params = params;

        this.User = new UserService(this);
    }

    get(path: string, query?: Record<string, any>): Promise<any> {
        return sendRequest('GET', this.params, {
            path,
            query,
            cache: 'no-cache',
        }).then(responseJSON);
    }

    post(path: string, body?: BodyInit | null): Promise<any> {
        return sendRequest('POST', this.params, {
            path,
            body,
        }).then(responseJSON);
    }

    put(path: string, body?: BodyInit | null): Promise<any> {
        return sendRequest('PUT', this.params, {
            path,
            body,
            cache: 'no-cache',
        }).then(responseJSON);
    }

    delete(path: string, query?: Record<string, any>): Promise<any> {
        return sendRequest('PUT', this.params, {
            path,
            query,
        }).then(responseJSON);
    }
}
