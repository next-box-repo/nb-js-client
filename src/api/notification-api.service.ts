import type { Client } from '../classes/client';
import {
    NotificationActionGroup,
    NotificationRowAction,
    RequestBaseParams,
    ResponseItem,
    ResponseList,
    TaskNotification,
    UserNotification,
} from '../types';

const NOTIFICATIONS = '/notifications';
const NOTIFICATIONS_ALL = `${NOTIFICATIONS}/all`;
const NOTIFICATIONS_SUBSCRIPTION = `${NOTIFICATIONS}/subscription`;
const NOTIFICATIONS_SUBSCRIPTION_EXTENSION = `${NOTIFICATIONS_SUBSCRIPTION}/extension`;
const NOTIFICATIONS_PERMISSION = `${NOTIFICATIONS}/permission`;
const NOTIFICATIONS_TASK = `${NOTIFICATIONS}/task`;

export class NotificationApiService {
    constructor(private client: Client) {}

    list(
        params?: RequestNotificationListParams,
    ): Promise<ResponseListNotification> {
        return this.client.rest.get(NOTIFICATIONS, params);
    }

    task(id: number): Promise<ResponseItem<TaskNotification>> {
        return this.client.rest.get(`${NOTIFICATIONS_TASK}/${id}`);
    }

    toggleStatus(
        ids: number[],
        to_status: NotificationRowAction,
    ): Promise<void> {
        return this.client.rest.put(NOTIFICATIONS, { ids, to_status });
    }

    toggleAllStatus(to_status: NotificationRowAction): Promise<void> {
        return this.client.rest.put(NOTIFICATIONS_ALL, { to_status });
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
        return this.client.rest.post(NOTIFICATIONS_PERMISSION, {
            enabled: permission,
        });
    }

    getSubscription(): Promise<NotificationActionGroup> {
        return this.client.rest.get(NOTIFICATIONS_SUBSCRIPTION);
    }

    getSubscriptionExtension(): Promise<NotificationActionGroup> {
        return this.client.rest.get(NOTIFICATIONS_SUBSCRIPTION_EXTENSION);
    }

    setSubscription(data: NotificationActionGroup): Promise<void> {
        const params = {
            action_groups: {
                ...data,
            },
        };

        return this.client.rest.post(NOTIFICATIONS_SUBSCRIPTION, params);
    }

    setSubscriptionExtension(data: NotificationActionGroup): Promise<void> {
        const params = {
            application_groups: {
                ...data,
            },
        };

        return this.client.rest.post(
            NOTIFICATIONS_SUBSCRIPTION_EXTENSION,
            params,
        );
    }
}

export interface RequestNotificationListParams extends RequestBaseParams {
    read?: boolean;
    search?: string;
    lang?: string;
}

export type ResponseListNotification = ResponseList<UserNotification> & {
    total_read: number;
    total_unread: number;
    total_all: number;
};
