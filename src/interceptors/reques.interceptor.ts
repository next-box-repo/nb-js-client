import { NbAppState } from '../types';

export type Interceptor<T = any> = {
    fulfilled: (value: T) => T | Promise<T>;
    rejected?: (error: any) => any;
};

export class InterceptorManager {
    private interceptors: Interceptor<NbAppState>[] = [];

    use(
        fulfilled: (state: NbAppState) => Promise<NbAppState>,
        rejected?: (error: any) => Promise<void>,
    ): void {
        this.interceptors.push({ fulfilled, rejected });
    }

    public async apply(state: NbAppState): Promise<NbAppState> {
        for (const interceptor of this.interceptors) {
            try {
                state = await interceptor.fulfilled(state);
            } catch (error) {
                if (interceptor.rejected) {
                    await interceptor.rejected(error);
                }
            }
        }

        return state;
    }
}
