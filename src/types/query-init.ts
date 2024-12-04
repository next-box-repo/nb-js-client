import { ResponseList } from './base';
import { Extension, ExtensionDefault } from './extension';
import { License } from './license';
import { LockScreen } from './lock-screen';
import { UserNotification } from './notification';
import { Restriction } from './restriction';
import { User } from './user';

export interface QueryInit {
    license?: License;
    unread_notifications?: ResponseList<UserNotification> & {
        total_all: number;
    };

    extensions_apps?: ResponseList<Extension>;
    extensions_defaults: ResponseList<ExtensionDefault>;

    me?: User;
    cache_users: User[];

    lock_screen: LockScreen;
    restrictions?: Restriction;

    open_in_desktop_settings: { open_in_desktop_enabled: boolean };

    // нужен для devtools
    inject_scripts?: string[];
}
