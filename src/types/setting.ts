import { Lang } from './base';

export type SettingLang = string | Lang | null;

export enum SettingControlType {
    Text = 'text',
    String = 'string',
    Number = 'number',
    CheckBox = 'checkbox',
    Select = 'select',
    RadioList = 'radio_list',
    ConnectionChoose = 'connection_choose',
    MultiConnectionChoose = 'multi_connection_choose',
}

export interface Setting {
    fields: SettingField[];
    title?: SettingLang;
    name?: string;
    context?: string;
    toggle_box?: boolean;
    collapsed_box?: boolean;
    activity_switch?: boolean;
}

export interface SettingVariant {
    label?: SettingLang;
    value: any;
}

export interface SettingField {
    name: string;
    value: any;

    label?: SettingLang;
    help?: SettingLang;
    placeholder?: SettingLang;

    view?: SettingFieldView;

    control: {
        type: SettingControlType;
        filter?: Record<string, any>;
        variants?: SettingVariant[];
    };
}

export type SettingFieldView =
    | SettingViewConnectionChoose
    | SettingViewSelect
    | any;

export interface SettingViewConnectionChoose {
    id: number;
    name: string;
    owner_id: number;
}

export interface SettingViewSelect {
    show_clear?: boolean;
}

export interface SettingValueField {
    name: string;
    value: any;
}

export interface SettingValue {
    name: string;
    context?: string;
    fields: SettingValueField[];
    activity_switch?: boolean;
}
