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
