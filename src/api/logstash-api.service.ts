import { Client } from '../classes';
import {
    HttpResponse,
    RequestBaseParams,
    RequestLogsActionsParams,
    RequestObserve,
    ResponseList,
    ResponseType,
    UsersLog,
} from '../types';

const LOGS = '/logs';
const LOGS_USERS = `${LOGS}/users`;
const LOGS_USERS_ACTIONS = `${LOGS_USERS}/actions`;

export class LogstashApiService {
    constructor(private client: Client) {}

    getUsersLogs(
        params: RequestUsersLogParams,
    ): Promise<ResponseList<UsersLog>> {
        return this.client.rest.get(`${LOGS_USERS}`, params);
    }

    getLogsActions(
        params: RequestLogsActionsParams,
    ): Promise<ResponseList<string>> {
        return this.client.rest.get(`${LOGS_USERS_ACTIONS}`, params);
    }
}

export interface RequestUsersLogParams extends RequestBaseParams {
    user_id?: string;
    search_field?: string;
    from_date?: string;
    to_date?: string;
    with_me?: boolean;
    actions?: string[];
}
function of(): Promise<HttpResponse<string>> {
    throw new Error('Function not implemented.');
}
