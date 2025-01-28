import { Client } from '../classes';
import { RequestUsersLogParams, ResponseList, UsersLog } from '../types';

export class LogstashApi {
    constructor(private client: Client) {}

    getUsersLogs(
        params: RequestUsersLogParams,
    ): Promise<ResponseList<UsersLog>> {
        return this.client.rest.get(`/logs/users`, params);
    }

    getSystemLogs(path: string): Promise<string> {
        return this.client.rest.get(path);
    }
}
