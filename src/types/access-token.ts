import { AccessRights } from './access-rights';
import { UserType } from './user';

export interface AccessToken {
    exp: number;
    iat: number;
    login: string;
    user_id: number;
    is_remember: boolean;
    with_cookie: boolean;
    grant_access_all: boolean;
    user_type: UserType;
    permissions: { [key: string]: AccessRights[] };
}
