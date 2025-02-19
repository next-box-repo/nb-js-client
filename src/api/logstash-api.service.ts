import { Client } from '../classes';
import {
    HttpResponse,
    RequestBaseParams,
    RequestObserve,
    ResponseList,
    ResponseType,
    UsersLog,
} from '../types';

const LOGS = '/logs';

export class LogstashApiService {
    constructor(private client: Client) {}

    getUsersLogs(
        params: RequestUsersLogParams,
    ): Promise<ResponseList<UsersLog>> {
        return this.client.rest.get(`${LOGS}/users`, params);
    }

    getSystemLogs(
        path: string,
        start: number,
        end: number,
    ): Promise<HttpResponse<string>> {
        return this.client.rest.get(
            `${LOGS}/${path}`,
            {},
            {
                observe: RequestObserve.Response,
                responseType: ResponseType.Text,
                headers: { Range: `bytes=${start}-${end}` },
            },
        );
    }
}

export interface RequestUsersLogParams extends RequestBaseParams {
    user_id?: string;
    search_field?: string;
    from_date?: string;
    to_date?: string;
    with_me?: boolean;
}
function of(): Promise<HttpResponse<string>> {
    throw new Error('Function not implemented.');
}
