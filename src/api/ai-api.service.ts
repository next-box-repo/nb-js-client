import type { Client } from '../classes/client';
import { AiModels, AiModelsParams } from '../types';

const AI = '/ai';
const AI_MODELS = `${AI}/models`;

export class AiApiService {
    constructor(private client: Client) {}

    models(data: AiModelsParams): Promise<AiModels> {
        return this.client.rest.post(AI_MODELS, data);
    }
}
