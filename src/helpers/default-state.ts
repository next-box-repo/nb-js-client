import { NbAppState } from '../types';

export const defaultState = (): NbAppState => {
    return {
        client: {
            host: window.location.origin,
            version: 1,
        },

        api: {
            path: '',
            headers: {},
            query: {},
        },
    };
};
