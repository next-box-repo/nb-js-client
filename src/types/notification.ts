import { RequestBaseParams, ResponseList } from './base';
import { PermissionType } from './divide';
import { StorageElementType } from './storage';
import { UserLabel } from './user';

export interface UserNotification {
    id: number;
    create_date: string;
    update_date: string;
    entity_type: NotificationEntityType;
    action: NotificationAction;

    title: string;
    msg: string;

    transition: boolean;

    read: boolean;
    style: NotificationStyle;
    payload: NotificationPayload;

    from_user_id?: number;
    owner?: UserLabel;
}

export type RequestNotificationListParams = RequestBaseParams & {
    read?: boolean;
    search?: string;
};
export type ResponseListNotification = ResponseList<UserNotification> & {
    total_all: number;
};

export enum NotificationEntityType {
    Dir = 'dir',
    File = 'file',
    User = 'user',
    Other = 'other',
    WorkDir = 'work_dir',
    License = 'license',
    Extension = 'extension',
    Connection = 'connection',
}

export enum NotificationAction {
    OpenSharing = 'open_sharing',
    ChangeSharing = 'change_sharing',
    CancelSharing = 'cancel_sharing',

    DivideDirAddFileToOwner = 'divide_dir_add_file_to_owner',
    DivideDirAddDirToOwner = 'divide_dir_add_dir_to_owner',
    DivideDirAddWorkDirToOwner = 'divide_dir_add_work_dir_to_owner',

    DivideConnectionAddFileToOwner = 'divide_connection_add_file_to_owner',
    DivideConnectionAddDirToOwner = 'divide_connection_add_dir_to_owner',

    CancelDivideDir = 'cancel_divide_dir',
    CancelDivideFile = 'cancel_divide_file',
    CancelDivideWorkDir = 'cancel_divide_work_dir',
    CancelDivideConnection = 'cancel_divide_connection',

    DeleteExtension = 'delete_extension',
    NewVersionExtension = 'new_version_extension',

    Other = 'other',
}

export enum NotificationRowAction {
    Read = 'read',
    Unread = 'unread',
    Delete = 'delete',
}

export enum NotificationStyle {
    Plain = 'plain',
    Success = 'success',
    Info = 'info',
    Warning = 'warning',
    Error = 'error',
}

export type NotificationActionGroup = {
    [key: string]: NotificationActionEnabledGroup;
};

interface NotificationActionEnabledGroup {
    enabled_system: boolean;
    enabled_mail: boolean;
}

export type NotificationPayload = PayloadFile | any;

export interface PayloadFile {
    access_mode: PermissionType;
    create_date: string;
    id: number;
    name: string;
    owner_id: number;
    path: string;
    to_user_id: number;
    type: StorageElementType;
    update_date: string;
}
