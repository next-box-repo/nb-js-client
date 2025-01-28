import { Client } from '../classes';
import {
    DivideMode,
    DivideResourceType,
    DivideResponseList,
    DivideScope,
    PermissionType,
    RequestUserDivideParams,
    ResponseItem,
    ResponseList,
    UserDivide,
} from '../types';

export class DivideApi {
    constructor(private client: Client) {}

    divideDelete(service: DivideScope, id: number): Promise<void> {
        return this.client.rest.delete(`${service}/divide/${id}`);
    }

    divideDeleteAll(
        service: DivideScope,
        resource: DivideResourceType,
        access_mode: PermissionType,
        is_to_user_group: boolean,
    ): Promise<void> {
        return this.client.rest.delete(`${service}/divide`, {
            ...this.makeParam(service, resource),
            is_to_user_group,
            access_mode,
        });
    }

    divideChange(
        service: DivideScope,
        id: number,
        access_mode: PermissionType,
    ): Promise<UserDivide> {
        return this.client.rest.put(
            `${service}/divide/${id}`,
            JSON.stringify({ access_mode }),
        );
    }

    divideCreate(
        service: DivideScope,
        resource: DivideResourceType,
        id: number,
        access_mode: PermissionType,
        key: DivideMode,
    ): Promise<ResponseItem<UserDivide>> {
        const data = {
            ...this.makeParam(service, resource),
            [key]: id,
            access_mode,
        };

        return this.client.rest.post(`${service}/divide`, JSON.stringify(data));
    }

    divideUsers(
        service: DivideScope,
        resource: DivideResourceType,
        params: RequestUserDivideParams,
    ): Promise<DivideResponseList> {
        return this.client.rest.get(`${service}/divide/users`, {
            ...this.makeParam(service, resource),
            ...params,
        });
    }

    restrictions(params?: any): Promise<ResponseList<UserDivide>> {
        return this.client.rest.get('/divide/restrictions', params);
    }

    restrictionsChange(
        token: number,
        data: { status: any; comment: string },
    ): Promise<ResponseList<UserDivide>> {
        return this.client.rest.put(
            `/divide/restrictions/${token}`,
            JSON.stringify(data),
        );
    }

    private makeParam(
        service: DivideScope,
        resource: DivideResourceType,
    ): Record<string, any> {
        const response: Record<string, any> = {};

        if (service === DivideScope.Connection) {
            response['connection_id'] = resource;
        } else {
            response['path'] = resource;
        }

        return response;
    }
}
