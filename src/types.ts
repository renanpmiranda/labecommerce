export enum PRODUCT_CATEGORIES {
    ACCESSORIES = "Accessories",
    GAMES = "Games",
    ELECTRONICS = "Electronics"
}

export type TUser = {
    id: string,
    name: string,
    email: string,
    password: string,
    created_at: string
}

export type TProduct = {
    id: string,
    name: string,
    price: number,
    category: PRODUCT_CATEGORIES
}

export type TPurchase = {
    id: string,    
    total_price: number,
    paid: number,
    delivered_at: string,
    buyer_id: string
}