import { RequestBaseParams } from './base';

export type HistoryRequestParams = RequestBaseParams & {
    path: string;
    divide_id?: number | null;
};

export type HistoryListRequestParams = HistoryRequestParams & RequestBaseParams;
