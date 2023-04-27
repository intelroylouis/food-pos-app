
export interface Product {
    id: number;
    name: string;
    price01: number;
    tax01: number;
    price02: number;
    tax02: number;
    amount: number;
    categoryId: number;
    imageUrl: string;
}

declare const data: Product[];

export default data;