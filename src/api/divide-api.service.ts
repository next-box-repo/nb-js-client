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
    RestrictionModeKey,
    UnionRestriction,
    UserDivide,
} from '../types';

const DIVIDE = '/divide';
const DIVIDE_RESTRICTIONS = `${DIVIDE}/restrictions`;

export class DivideApiService {
    constructor(private client: Client) {}

    divideDelete(service: DivideScope, id: number): Promise<void> {
        return this.client.rest.delete(`${service}/${DIVIDE}/${id}`);
    }

    divideDeleteAll(
        service: DivideScope,
        resource: DivideResourceType,
        access_mode: PermissionType,
        is_to_user_group: boolean,
    ): Promise<void> {
        return this.client.rest.delete(`${service}/${DIVIDE}`, {
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
        return this.client.rest.put(`${service}/divide/${id}`, { access_mode });
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

        return this.client.rest.post(`${service}/${DIVIDE}`, data);
    }

    divideUsers(
        service: DivideScope,
        resource: DivideResourceType,
        params: RequestUserDivideParams,
    ): Promise<DivideResponseList> {
        return this.client.rest.get(`${service}/${DIVIDE}/users`, {
            ...this.makeParam(service, resource),
            ...params,
        });
    }

    getRestriction(id: number): Promise<UnionRestriction> {
        return this.client.rest.get(`${DIVIDE_RESTRICTIONS}/${id}`);
    }

    restrictionSize(
        key: string | number,
        modeKey: RestrictionModeKey,
    ): Promise<number> {
        return this.client.rest.get(`/${modeKey}/restrictions/${key}/size`);
    }

    restrictions(params?: any): Promise<ResponseList<UserDivide>> {
        return this.client.rest.get(`${DIVIDE_RESTRICTIONS}`, params);
    }

    restrictionsChange(
        token: number,
        data: { status: any; comment: string },
    ): Promise<ResponseList<UserDivide>> {
        return this.client.rest.put(`${DIVIDE_RESTRICTIONS}/${token}`, data);
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
