export const applyInterceptors = async <T>(
    interceptors: {
        fulfilled: (arg: T) => T | Promise<T>;
        rejected?: (error: any) => T | Promise<T>;
    }[],
    arg: T,
): Promise<T> => {
    let response = arg;

    for (const interceptor of interceptors) {
        try {
            response = await interceptor.fulfilled(response);
        } catch (error) {
            if (interceptor.rejected) {
                response = await interceptor.rejected(error);
            } else {
                throw error;
            }
        }
    }

    return response;
};
