import { Client } from '../classes';
import {
    NotificationActionGroup,
    NotificationRowAction,
    RequestBaseParams,
    ResponseList,
    UserNotification,
} from '../types';

const NOTIFICATIONS = '/notifications';
const NOTIFICATIONS_ALL = `${NOTIFICATIONS}/all`;
const NOTIFICATIONS_SUBSCRIPTION = `${NOTIFICATIONS}/subscription`;
const NOTIFICATIONS_PERMISSION = `${NOTIFICATIONS}/permission`;

export class NotificationApiService {
    constructor(private client: Client) {}

    list(
        params?: RequestNotificationListParams,
    ): Promise<ResponseListNotification> {
        return this.client.rest.get(NOTIFICATIONS, params);
    }

    toggleStatus(
        ids: number[],
        to_status: NotificationRowAction,
    ): Promise<void> {
        return this.client.rest.put(
            NOTIFICATIONS,
            JSON.stringify({ ids, to_status }),
        );
    }

    toggleAllStatus(to_status: NotificationRowAction): Promise<void> {
        return this.client.rest.put(
            NOTIFICATIONS_ALL,
            JSON.stringify({ to_status }),
        );
    }

    delete(id: number[]): Promise<void> {
        return this.client.rest.delete(NOTIFICATIONS, { id });
    }

    deleteAll(): Promise<void> {
        return this.client.rest.delete(NOTIFICATIONS_ALL);
    }

    getPermission(): Promise<{ enabled: boolean }> {
        return this.client.rest.get(NOTIFICATIONS_PERMISSION);
    }

    setPermission(permission: boolean): Promise<void> {
        return this.client.rest.post(
            NOTIFICATIONS_PERMISSION,
            JSON.stringify({
                enabled: permission,
            }),
        );
    }

    getSubscription(): Promise<NotificationActionGroup> {
        return this.client.rest.get(NOTIFICATIONS_SUBSCRIPTION);
    }

    setSubscription(data: NotificationActionGroup): Promise<void> {
        const params = {
            action_groups: {
                ...data,
            },
        };

        return this.client.rest.post(
            NOTIFICATIONS_SUBSCRIPTION,
            JSON.stringify(params),
        );
    }
}

export interface RequestNotificationListParams extends RequestBaseParams {
    read?: boolean;
    search?: string;
    lang?: string;
}

export type ResponseListNotification = ResponseList<UserNotification> & {
    total_all: number;
};
