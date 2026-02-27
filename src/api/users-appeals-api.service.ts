import { Client } from "../classes";
import { ResponseList } from "../types";

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
    
    uploadFile(file: File): Promise<{ row: string }> {
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

export interface Category {
    code: string;
    name: string;
}

export interface Appeal {
    category_code: string;   
    description: string;
    id_files?: string[];
    subcategory_code?: string;
}
