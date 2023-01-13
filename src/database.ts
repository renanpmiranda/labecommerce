import { TUser, TProduct, TPurchase } from './types';

export const users: TUser[] = [
    {
        id:"00",
        email:"fulano@gmail.com",
        password:"bananinha"    
    },
    {
        id:"01",
        email:"beltrano@gmail.com",
        password:"moranguinho"
    }
]

export const products: TProduct[] = [
    {
        id:"00",
        name:"Produto 01",
        price:10,
        category:"Categoria 1"
    },
    {
        id:"01",
        name:"Produto 02",
        price:20,
        category:"Categoria 2"
    }
]

export const purchases: TPurchase[] = [
    {
        userId: "00",
        productId: "00",
        quantity: 2,
        totalPrice: 20
    },
    {
        userId: "01",
        productId: "01",
        quantity: 1,
        totalPrice: 20
    }
]