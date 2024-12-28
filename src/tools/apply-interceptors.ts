export const applyInterceptors = async <T>(
    interceptors: {
        fulfilled: (arg: T) => T | Promise<T>;
        rejected?: (error: any) => T | Promise<T>;
    }[],
    arg: T,
): Promise<T> => {
    let result = arg;

    for (const interceptor of interceptors) {
        try {
            result = await interceptor.fulfilled(result);
        } catch (error) {
            if (interceptor.rejected) {
                result = await interceptor.rejected(error);
            } else {
                throw error;
            }
        }
    }

    return result;
};
