export type Interceptor<T = any> = {
    fulfilled: (value: T) => T | Promise<T>;
    rejected: (error: any) => any;
};
