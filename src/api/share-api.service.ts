import { Client } from '../classes';
import {
    RequestBaseParams,
    ResponseList,
    RestrictionStatus,
    ShareInfo,
    UnionRestriction,
} from '../types';

const SHARE = '/share';
const SHARE_RESTRICTIONS = `${SHARE}/restrictions`;
const SHARE_LOGIN = `${SHARE}/login`;

export class ShareApiService {
    constructor(private client: Client) {}

    info(share_token: string): Promise<ShareInfo> {
        return this.client.rest.get(`${SHARE}?share_token=${share_token}`);
    }

    checkPassword(password: string, share_token: string): Promise<any> {
        const encodedPassword = encodeURIComponent(password);

        return this.client.rest.get(
            `${SHARE}/password?share_token=${share_token}&share_pass=${encodedPassword}`,
        );
    }

    getRestriction(token: string): Promise<UnionRestriction> {
        return this.client.rest.get(`${SHARE_RESTRICTIONS}/${token}`);
    }

    restrictions(params?: RequestBaseParams): Promise<ResponseList<ShareInfo>> {
        return this.client.rest.get(SHARE_RESTRICTIONS, params);
    }

    restrictionsChange(
        token: string,
        data: { status: RestrictionStatus; comment: string },
    ): Promise<ResponseList<ShareInfo>> {
        return this.client.rest.put(`${SHARE_RESTRICTIONS}/${token}`, data);
    }

    login(data: RequestShareLoginParams): Promise<{ share_token: string }> {
        return this.client.rest.post(`${SHARE_LOGIN}`, data);
    }
}

export interface RequestShareLoginParams {
    share_key: string;
    share_password?: string;
}
