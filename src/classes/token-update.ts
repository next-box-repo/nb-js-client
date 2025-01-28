import { AuthApi } from '../api';
import { getCookieValue } from '../tools';
import { AuthToken } from '../types';

const MILLISECONDS_IN_SECOND = 1000;
const TOKEN_EXPIRATION_BUFFER_MS = 3000;

export class TokenUpdate {
    private isUpdating = false;

    private tokenUpdatePromise: Promise<AuthToken> | null = null;
    private tokenUpdateResolve: ((token: AuthToken) => void) | null = null;

    constructor(private authApiService: AuthApi) {}

    isTokenExpire(timestamp: number): boolean {
        if (!timestamp) return false;

        const expTime = timestamp * MILLISECONDS_IN_SECOND;
        const curTime = new Date().getTime();

        return expTime <= curTime + TOKEN_EXPIRATION_BUFFER_MS;
    }

    async refreshToken(authToken: AuthToken): Promise<AuthToken | null> {
        const { access_token, refresh_token } = authToken;

        if (!access_token || !refresh_token) return null;
        if (this.isUpdating) return this.waitForTokenUpdate();

        this.isUpdating = true;

        try {
            const response = await this.authApiService.updateToken(authToken);

            if (response && response.access_token && response.refresh_token) {
                const tokens: AuthToken = {
                    access_token: response.access_token,
                    refresh_token: response.refresh_token,
                };

                if (getCookieValue('access_token') === tokens.access_token) {
                    localStorage.setItem('refresh-token', tokens.refresh_token);
                }

                if (this.tokenUpdateResolve) {
                    this.tokenUpdateResolve(tokens);
                    this.tokenUpdateResolve = null;
                }

                return tokens;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        } finally {
            this.isUpdating = false;
        }
    }

    private waitForTokenUpdate(): Promise<AuthToken> {
        if (!this.tokenUpdatePromise) {
            this.tokenUpdatePromise = new Promise<AuthToken>((resolve) => {
                this.tokenUpdateResolve = resolve;
            });
        }

        return this.tokenUpdatePromise;
    }
}
