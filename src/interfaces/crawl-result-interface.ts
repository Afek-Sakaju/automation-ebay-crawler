export interface Product {
    id?: string;
    position?: number;
    title?: string;
    price?: string;
    sponsored?: boolean;
    shipping?: string;
    image?: string;
}

export interface SearchResult {
    productsData: Product[];
    relatedSearchesText: string[];
}
