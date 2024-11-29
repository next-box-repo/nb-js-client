export interface Discovery {
    id: number;
    create_date: string;
    update_date: string;

    active: boolean;
    back_url: string;
    front_url: string;
    instance_number: number;

    name: string;
    route: null;
    route_name: string;
    with_swagger: boolean;
    dynamic_config_path?: string;

    version: string;
}
