import { Client } from '../classes';
import {
    RequestBaseParams,
    ResponseList,
    RestrictionStatus,
    ShareInfo,
} from '../types';

export class ShareApi {
    constructor(private client: Client) {}

    info(path: string, share_token: string): Promise<ShareInfo> {
        const search = new URLSearchParams({ path, share_token });

        return this.client.rest.get(`/share?${search.toString()}`);
    }

    checkPassword(password: string, share_token: string): Promise<any> {
        const encodedPassword = encodeURIComponent(password);

        return this.client.rest.get(
            `share/password?share_token=${share_token}&share_pass=${encodedPassword}`,
        );
    }

    checkToken(share_token: string): Promise<any> {
        return this.client.rest.get(`share?share_token=${share_token}`);
    }

    restrictions(params?: RequestBaseParams): Promise<ResponseList<ShareInfo>> {
        return this.client.rest.get('/share/restrictions', params);
    }

    restrictionsChange(
        token: string,
        data: { status: RestrictionStatus; comment: string },
    ): Promise<ResponseList<ShareInfo>> {
        return this.client.rest.put(
            `/share/restrictions/${token}`,
            JSON.stringify(data),
        );
    }
}
