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
