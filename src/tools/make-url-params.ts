export const makeUrlParams = (params: Record<string, any>) => {
    const query = new URLSearchParams();

    Object.keys(params).forEach((key) => {
        if (Array.isArray(params[key])) {
            params[key].forEach((value: any) => {
                query.append(key, value);
            });
        } else {
            query.append(key, params[key]);
        }
    });

    return query;
};
