const RequestInterceptor = require("./interceptors/request.interceptor");
const ResponseInterceptor = require("./interceptors/response.interceptor");

class Client {
  constructor({ host, version }) {
    this.host = host;
    this.version = version || 1;

    this.requestInterceptors = new RequestInterceptor();
    this.responseInterceptors = new ResponseInterceptor();
  }

  request = {
    use: (onFulfilled, onRejected) => {
      this.requestInterceptors.use(onFulfilled, onRejected);
    },
  };

  response = {
    use: (onFulfilled, onRejected) => {
      this.responseInterceptors.use(onFulfilled, onRejected);
    },
  };

  rest = {
    get: (path, params) =>
      this.sendRequest("GET", path, {
        host: this.host,
        headers: { "Content-Type": "application/json" },
        params: { ...params },
        cache: "no-cache",
      }),
    post: (path, body) =>
      this.sendRequest("POST", path, {
        host: this.host,
        headers: { "Content-Type": "application/json" },
        params: {},
        body,
      }),
    put: (path, body) =>
      this.sendRequest("PUT", path, {
        host: this.host,
        headers: { "Content-Type": "application/json" },
        params: {},
        cache: "no-cache",
        body,
      }),
    delete: (path, params) =>
      this.sendRequest("PUT", path, {
        host: this.host,
        headers: { "Content-Type": "application/json" },
        params: { ...params },
      }),
  };

  async sendRequest(method, path, options) {
    const headers = { ...options.headers };

    options = await this.requestInterceptors.apply(options);

    if (options.params) {
      path += "?" + new URLSearchParams(options.params).toString();
    }

    const params = {
      method,
      headers,
      body: JSON.stringify(options.body),
    };

    // const response = await fetch(
    //   new URL(decodeURI(path), `${options.host}/api/v${this.version}`),
    //   params
    // );
    const response = await fetch(path, params);

    let responseData = await response.json();
    responseData = await this.responseInterceptors.apply(responseData);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return responseData;
  }

  resetParams(newParams) {
    this.params = { ...this.params, ...newParams };
  }
}

module.exports = Client;
