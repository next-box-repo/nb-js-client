import { EngineType, Lang, RequestBaseParams } from './base';
import { Setting, SettingValue } from './setting';
import { StorageElementType } from './storage';

export interface ExtensionDefault {
    ext_value: string;
    extension_meta_uniq_key: string;
    icon_path: string;
    devlocal?: boolean;
}

export enum ExtensionType {
    App = 'app',
    File = 'file',
    WorkDir = 'work_dir',
}

export enum ExtensionFileMode {
    Read = 'read',
    ReadAndWrite = 'read_and_write',
    Write = 'write',
}

export interface Extension {
    id: number;
    version: string;
    uniq_key: string;

    name: Lang;
    description: Lang;

    create_date: string;
    update_date: string;

    icon: string;
    type: ExtensionType;
    path: string;

    devlocal?: boolean;
    dev_frame_params?: {
        engine: EngineType;
        host?: string;
        port?: number;
    };

    latest_repo_version?: string;
    tags?: string[];

    file?: {
        mode: ExtensionFileMode;
        ext: string[];
        default_ext?: string;
        index: string;
    };

    app?: {
        menu: {
            index: string;
            icon: string;
            label: Lang;
        };
    };

    work_dir?: {
        index: string;
    };

    with_settings?: boolean;
    settings?: SettingValue[];
    settings_template?: Setting[];
}

export interface ExtensionMetaPayload {
    uniq_key: string;
}

export interface ExtensionTag {
    tag: string;
    count: number;
}

export interface ExtensionExternalInList {
    id: number;
    create_date: string;
    update_date: string;
    name: string;
    description: string;
    uniq_key: string;
    version: string;
    tags: string[];
    links: string[];
    downloads: number;
    liked: false;
    likes: number;
    recommended: boolean;
}

export interface ExtensionExternal extends ExtensionExternalInList {
    versions: VersionExtension[];
    images?: string[];
    with_readme?: boolean;
}

interface VersionExtension {
    version: string;
    size: number;
}

export interface UserNamesExtension {
    name: string;
    create_date: string;
}

export interface NameExtensionListParams extends RequestBaseParams {
    search?: string | null;
}

export interface ExtensionListParams extends RequestBaseParams {
    search?: string | null;
    uniq_key?: string[];
    file_name_ext?: string;
    type?: StorageElementType[];
    ext_value?: string | null;
    file_mode?: ExtensionFileMode[];
    lang?: string;
    tag?: string;
}

export type ExtensionTagListParams = Pick<
    ExtensionListParams,
    'file_mode' | 'type'
>;
