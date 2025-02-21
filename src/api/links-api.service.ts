import { Client } from '../classes';

const LINKS = '/links';

export class LinksApiService {
    constructor(private client: Client) {}

    createShortLink(params: CutLinkRequest): Promise<CutLinkResponse> {
        return this.client.rest.post(LINKS, JSON.stringify(params));
    }

    updateShortLink(params: CutLinkRequest): Promise<CutLinkResponse> {
        return this.client.rest.put(LINKS, JSON.stringify(params));
    }
}

export interface CutLinkRequest {
    entity_id: number;
    entity_type: string;
    full_url: string;
    reload_short_url?: boolean;
}

interface CutLinkResponse extends CutLinkRequest {
    full_url: string;
    short_url: string;
}
