export enum AccessRights {
    // Раздел лицензирования
    LicenseRead = 'license_read', // Просмотр
    LicenseManage = 'license_edit', // Управление лицензией

    // Пользователи
    UsersRead = 'users_read', // Просмотр
    UsersCreate = 'users_create', // Создание/редактирование
    UsersActivate = 'users_activate', // Активация/деактивация

    // Группы
    GroupsRead = 'groups_read', // Просмотр
    GroupsCreate = 'groups_create', // Создание/редактирование

    // Роли
    RolesRead = 'roles_read', // Просмотр списка
    RolesCreate = 'roles_create', // Создание/редактирование

    // Мой диск
    Share = 'share', // Шаринг доступа по ссылке
    Divide = 'divide', // Предоставление доступа

    // Расширения
    ExtensionsRead = 'extensions_read', // Просмотр
    ExtensionsManage = 'extensions_write', // Управление расширениями

    // Ограничение доступа(шаринг)
    RestrictionShareRead = 'restriction_share_read', // Просмотр
    RestrictionShareWrite = 'restriction_share_write', // Управление шарингом

    // Ограничение доступа(поделиться)
    RestrictionDivideRead = 'restriction_divide_read', // Просмотр
    RestrictionDivideWrite = 'restriction_divide_write', // Управление доступами

    // Аудит
    ReadUserLogs = 'read_user_logs', // Просмотр пользовательских логов

    // Подключения
    ConnectionsRead = 'connections_read', // Просмотр
    ConnectionsDividing = 'connections_dividing', // Предоставление доступа(поделиться)

    ConnectionsYandexDisk = 'connections_yandex_disk', // Yandex диск
    ConnectionsSsh = 'connections_ssh', // Ssh
    ConnectionsMail = 'connections_mail', // Почта
    ConnectionsS3 = 'connections_s3', // S3
    ConnectionsDiscord = 'connections_discord', // Discord
    ConnectionsWebdav = 'connections_webdav', // Webdav
    ConnectionsNextcloud = 'connections_nextcloud', // Nextcloud
    ConnectionsNextbox = 'connections_nextbox', // Nextbox
    ConnectionsHttpProxy = 'connections_http_proxy', // Http proxy

    // Информация системы
    SystemInfoServiceList = 'system_info_service_list', // Просмотр

    // Настройки
    SettingsRead = 'settings_read', // Просмотр
    SettingsWrite = 'settings_write', // Управление
}

export const CONNECTIONS_PERMISSION = [
    AccessRights.ConnectionsYandexDisk,
    AccessRights.ConnectionsSsh,
    AccessRights.ConnectionsMail,
    AccessRights.ConnectionsS3,
    AccessRights.ConnectionsS3,
    AccessRights.ConnectionsDiscord,
    AccessRights.ConnectionsWebdav,
    AccessRights.ConnectionsNextcloud,
    AccessRights.ConnectionsNextbox,
    AccessRights.ConnectionsHttpProxy,
];
