import { RequestBaseParams } from './base';

export interface UsersLog {
    create_date: string;
    service_name: string;
    user_login: string;
    event_type: string;
    action: string;
    resource: string;
    description: string;
}

export interface RequestUsersLogParams extends RequestBaseParams {
    user_id?: string;
    search_field?: string;
    from_date?: string;
    to_date?: string;
    with_me?: boolean;
}