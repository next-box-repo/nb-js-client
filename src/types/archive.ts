import { NotificationAction } from "./notification";

export interface ArchiveProcess<T extends ArchivePayload | ArchiveEndPayload> {
    create_date: string;
    entity_type: string;
    service_name: string;
    action: NotificationAction;
    title: string;
    read: boolean;
    style: string;
    payload: T;
    user_id: number;
    event_timestamp: string;
    type_message: string;
    from_user_id: number | null;
    id?: number;
}

export interface ArchivePayload {
    process_id: string;
    src_path: string;
    zip_name: string;
    current_file: string;
    sum_size: number;
    written_size: number;
    progress: number;
    speed: number;
    seconds_left: number;
    dst_path?: string;
}

export interface ArchiveEndPayload {
    process_id: string;
    element_path: string;
    ref_code: string;
    zip_name: string;
    error?: string;
    divide_id?: number;
    dst_divide_id?: number;
    zip_size?: number;
}
