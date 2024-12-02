import { Api } from '../classes';
import {
    CreateUserParams,
    RequestBaseParams,
    RequestUserListParams,
    ResponseItem,
    ResponseList,
    User,
    UserSession,
    UserToken,
} from '../types';

const USERS = '/users';
const USERS_ME = `${USERS}/me`;
const USERS_ME_AVATARS = `${USERS_ME}/avatars`;
const USERS_ME_SESSIONS = `${USERS_ME}/sessions`;
const USERS_ME_TOKEN = `${USERS_ME}/tokens`;
const USERS_CHANGE_MY_PASSWORD = `${USERS_ME}/change-password`;

export class UserApiService {
    constructor(private api: Api) {}

    list(params: RequestUserListParams): Promise<ResponseList<User>> {
        debugger;
        return this.api.get(USERS, params);
    }

    get(id: number): Promise<ResponseItem<User>> {
        return this.api.get(USERS + `/${id}`);
    }

    create(data: CreateUserParams): Promise<ResponseItem<User>> {
        return this.api.post(USERS, JSON.stringify(data));
    }

    update(id: number, data: CreateUserParams): Promise<ResponseItem<User>> {
        return this.api.put(USERS + `/${id}`, JSON.stringify(data));
    }

    delete(id: number, params?: { hard: boolean }): Promise<void> {
        return this.api.delete(`${USERS}/${id}`, params);
    }

    restore(id: number): Promise<void> {
        return this.api.post(`${USERS}/${id}/restore`);
    }

    me(): Promise<ResponseItem<User>> {
        return this.api.get(USERS_ME);
    }

    updateMe(data: CreateUserParams): Promise<ResponseItem<User>> {
        return this.api.put(USERS_ME, JSON.stringify(data));
    }

    createToken(data: {
        name: string;
        expire_in: string | null;
    }): Promise<UserToken> {
        return this.api.post(USERS_ME_TOKEN, JSON.stringify(data));
    }

    listToken(params: RequestBaseParams): Promise<ResponseList<UserToken>> {
        return this.api.get(USERS_ME_TOKEN, params);
    }

    deleteToken(id: number): Promise<void> {
        return this.api.delete(`${USERS_ME_TOKEN}/${id}`);
    }

    changeMyPassword(data: {
        new_password: string;
        old_password: string;
    }): Promise<{ success: boolean }> {
        return this.api.put(USERS_CHANGE_MY_PASSWORD, JSON.stringify(data));
    }

    changeUsersPassword(
        id: number,
        data: { new_password: string },
    ): Promise<{ success: boolean }> {
        return this.api.put(
            `${USERS}/${id}/change-password`,
            JSON.stringify(data),
        );
    }

    meUploadAvatar(
        file: Blob,
        fileName: string,
    ): Promise<{ file_path: string }> {
        const data = new FormData();
        data.append('file', file, fileName);
        return this.api.post(USERS_ME_AVATARS, data);
    }

    meDeleteAvatar(): Promise<void> {
        return this.api.delete(USERS_ME_AVATARS);
    }

    meListSession(
        params: RequestBaseParams,
    ): Promise<ResponseList<UserSession>> {
        return this.api.get(USERS_ME_SESSIONS, params);
    }

    meDeleteSession(id?: number): Promise<void> {
        let path = USERS_ME_SESSIONS;

        if (id) path += `/${id}`;

        return this.api.delete(path);
    }

    setRole(id: number, role_id: number | null = null): Promise<void> {
        return this.api.put(
            `${USERS}/${id}/roles`,
            JSON.stringify({ role_id }),
        );
    }
}
