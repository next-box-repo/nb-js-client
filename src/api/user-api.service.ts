import { Client } from '../classes';
import {
    AuthToken,
    RequestBaseParams,
    ResponseItem,
    ResponseList,
    User,
    UserParams,
    UserParamsLabel,
    UserSession,
    UserStatus,
    UserToken,
    UserType,
} from '../types';

const USERS = '/users';
const USERS_ME = `${USERS}/me`;
const USERS_ME_AVATARS = `${USERS_ME}/avatars`;
const USERS_ME_SESSIONS = `${USERS_ME}/sessions`;
const USERS_ME_TOKEN = `${USERS_ME}/tokens`;
const USERS_ME_PARAMS = `${USERS_ME}/params`;
const USERS_CHANGE_MY_PASSWORD = `${USERS_ME}/change-password`;
const USERS_INITIAL = `${USERS}/initial`;
export class UserApiService {
    constructor(private client: Client) {}

    list(params: RequestUserListParams): Promise<ResponseList<User>> {
        return this.client.rest.get(USERS, params);
    }

    get(id: number): Promise<ResponseItem<User>> {
        return this.client.rest.get(USERS + `/${id}`);
    }

    create(data: CreateUserParams): Promise<ResponseItem<User>> {
        return this.client.rest.post(USERS, data);
    }

    update(id: number, data: CreateUserParams): Promise<ResponseItem<User>> {
        return this.client.rest.put(USERS + `/${id}`, data);
    }

    delete(id: number, params?: { hard: boolean }): Promise<void> {
        return this.client.rest.delete(`${USERS}/${id}`, params);
    }

    restore(id: number): Promise<void> {
        return this.client.rest.post(`${USERS}/${id}/restore`);
    }

    me(): Promise<ResponseItem<User>> {
        return this.client.rest.get(USERS_ME);
    }

    updateMe(data: CreateUserParams): Promise<ResponseItem<User>> {
        return this.client.rest.put(USERS_ME, data);
    }

    createToken(data: {
        name: string;
        expire_in: string | null;
    }): Promise<UserToken> {
        return this.client.rest.post(USERS_ME_TOKEN, data);
    }

    listToken(params: RequestBaseParams): Promise<ResponseList<UserToken>> {
        return this.client.rest.get(USERS_ME_TOKEN, params);
    }

    deleteToken(id: number): Promise<void> {
        return this.client.rest.delete(`${USERS_ME_TOKEN}/${id}`);
    }

    changeMyPassword(data: {
        new_password: string;
        old_password: string;
    }): Promise<{ success: boolean }> {
        return this.client.rest.put(USERS_CHANGE_MY_PASSWORD, data);
    }

    changeUsersPassword(
        id: number,
        data: { new_password: string },
    ): Promise<{ success: boolean }> {
        return this.client.rest.put(`${USERS}/${id}/change-password`, data);
    }

    meUploadAvatar(
        file: Blob,
        fileName: string,
    ): Promise<{ file_path: string }> {
        const data = new FormData();
        data.append('file', file, fileName);
        return this.client.rest.post(USERS_ME_AVATARS, data);
    }

    meDeleteAvatar(): Promise<void> {
        return this.client.rest.delete(USERS_ME_AVATARS);
    }

    meListSession(
        params: RequestBaseParams,
    ): Promise<ResponseList<UserSession>> {
        return this.client.rest.get(USERS_ME_SESSIONS, params);
    }

    meDeleteSession(id?: number): Promise<void> {
        let path = USERS_ME_SESSIONS;

        if (id) path += `/${id}`;

        return this.client.rest.delete(path);
    }

    setRole(id: number, role_id: number | null = null): Promise<void> {
        return this.client.rest.put(`${USERS}/${id}/roles`, { role_id });
    }

    meParams(name: string): Promise<UserParams> {
        return this.client.rest.get(USERS_ME_PARAMS, { name });
    }

    meSetParams(param: UserParamsLabel, value: any): Promise<UserParams> {
        return this.client.rest.post(`${USERS_ME_PARAMS}/${param}`, value);
    }

    meListParams(): Promise<ResponseList<UserParams>> {
        return this.client.rest.get(USERS_ME_PARAMS);
    }

    initial(data: { login: string; password: string }): Promise<AuthToken> {
        return this.client.rest.post(USERS_INITIAL, data);
    }
}

export interface RequestUserListParams extends RequestBaseParams {
    email?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    login?: string;
    is_admin?: boolean;
    id?: number[];
    role_ids?: number[];
    statuses?: UserStatus[];
    search_field?: string;
    with_me?: boolean;
    type?: UserType;
    exclude_type?: UserType;
    exclude_ids?: number[];
}

export type CreateUserParams = Pick<
    User,
    | 'first_name'
    | 'last_name'
    | 'middle_name'
    | 'email'
    | 'home_path'
    | 'password'
    | 'role_id'
>;
