import { Client } from "../classes";
import { ResponseItem, ResponseList } from "../types";
import { Appeal, Category } from "../types/users-appeals";

const APPEALS = '/users/appeals';
const CATEGORY = `${APPEALS}/category`;
const SUBCATEGORY = `${APPEALS}/subcategory`;
const FILE = `${APPEALS}/file`;

export class UsersAppealsApiService {
    constructor(private client: Client) {}

    category(): Promise<ResponseList<Category>> {
        return this.client.rest.get(CATEGORY);
    }
    
    subcategory(category_code: string): Promise<ResponseList<Category>> {
        return this.client.rest.get(SUBCATEGORY, {category_code});
    }
    
    uploadFile(file: File): Promise<ResponseItem<string>> {
        const formData = new FormData();
        formData.append('file', file);

        return this.client.rest.post(FILE, formData);
    }
    
    deleteFile(id: string): Promise<void> {
        return this.client.rest.delete(`${FILE}/${id}`);
    }

    createAppeal(data: Appeal): Promise<void> {
        return this.client.rest.post(APPEALS, data);
    }    
}


