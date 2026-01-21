import { RequestBaseParams } from './base';

export interface UsersLog {
    create_date: string;
    service_name: string;
    user_id: number;
    event_type: string;
    action: string;
    resource: string;
    description: string;
    ip: string;
}

export interface RequestLogsActionsParams {
    limit?: number;
    offset?: number;
    search_field?: string;
}
