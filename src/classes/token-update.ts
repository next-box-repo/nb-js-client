import { RequestAuthTokenParams } from '../api';
import { getCookieValue } from '../tools';
import { AuthToken } from '../types';
import { BASE_URL_V1, HOST } from './rest';

const MILLISECONDS_IN_SECOND = 1000;
const TOKEN_EXPIRATION_BUFFER_MS = 3000;

export class TokenUpdate {
    isUpdating = false;

    private tokenUpdateResolve: ((token: AuthToken) => void) | null = null;

    isTokenExpire(timestamp: number): boolean {
        if (!timestamp) return false;

        const expTime = timestamp * MILLISECONDS_IN_SECOND;
        const curTime = new Date().getTime();

        return expTime <= curTime + TOKEN_EXPIRATION_BUFFER_MS;
    }

    async refreshToken(params: RequestAuthTokenParams): Promise<any> {
        const { access_token, refresh_token } = params;

        if (!access_token || !refresh_token) return null;
        if (this.isUpdating) return this.waitForTokenUpdate();

        this.isUpdating = true;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            const url = `${HOST}${BASE_URL_V1}/login/update`;

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.send(
                JSON.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token,
                }),
            );

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (
                            response &&
                            response.access_token &&
                            response.refresh_token
                        ) {
                            const tokens: AuthToken = {
                                access_token: response.access_token,
                                refresh_token: response.refresh_token,
                            };

                            if (
                                getCookieValue('access_token') ===
                                tokens.access_token
                            ) {
                                localStorage.setItem(
                                    'refresh-token',
                                    tokens.refresh_token,
                                );
                            }

                            if (this.tokenUpdateResolve) {
                                this.tokenUpdateResolve(tokens);
                                this.tokenUpdateResolve = null;
                            }

                            resolve(tokens);
                        } else {
                            resolve(null);
                        }
                    } catch (error) {
                        reject(new Error('Failed to parse response JSON.'));
                    }
                } else resolve(null);
            };

            xhr.onerror = () => {
                reject(new Error('Network error occurred'));
            };

            xhr.onloadend = () => {
                this.isUpdating = false;
            };
        });
    }

    async waitForTokenUpdate(): Promise<void> {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (!this.isUpdating) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }
}
