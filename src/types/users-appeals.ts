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