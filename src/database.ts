// import { TUser, TProduct, TPurchase, PRODUCT_CATEGORIES } from './types';

// export const users: TUser[] = [
//     {
//         id:"00",
//         email:"fulano@gmail.com",
//         password:"bananinha"    
//     },
//     {
//         id:"01",
//         email:"beltrano@gmail.com",
//         password:"moranguinho"
//     }
// ]

// export const products: TProduct[] = [
//     {
//         id:"00",
//         name:"Produto 01",
//         price:10,
//         category:PRODUCT_CATEGORIES.ACCESSORIES
//     },
//     {
//         id:"01",
//         name:"Produto 02",
//         price:20,
//         category:PRODUCT_CATEGORIES.CLOTHES_AND_SHOES
//     }
// ]

// export const purchases: TPurchase[] = [
//     {
//         userId: "00",
//         productId: "00",
//         quantity: 2,
//         totalPrice: 20
//     },
//     {
//         userId: "01",
//         productId: "01",
//         quantity: 1,
//         totalPrice: 20
//     }
// ]

// export function createUser(id: string, email: string, password: string) : void {
//     console.log(users)
//     const newUser: TUser = {
//         id: id,
//         email: email,
//         password: password
//     }
//     users.push(newUser)
//     console.log(users)
//     console.log("Cadastro realizado com sucesso")
// }

// export function getAllUsers() : TUser[] {
//     return users
// }

// export function createProduct(id: string, name: string, price: number, category: PRODUCT_CATEGORIES) : void {
//     const newProduct: TProduct = {
//         id,
//         name,
//         price,
//         category
//     }
//     products.push(newProduct)
//     console.log("Produto criado com sucesso")
// }

// export function getAllProducts() : TProduct[] {
//     return products
// }

// export function getProductById(idToSearch: string) : TProduct[] | undefined {
//    return(products.filter((product) => {
//         return(product.id === idToSearch)
//     }))
// }

// export function queryProductsByName(q: string) : TProduct[] | undefined {
//     return(products.filter((product) => {
//         return(product.name === q)
//     }))
// }

// export function createPurchase(userId : string, productId : string, quantity : number, totalPrice : number) : void {
//     const newPurchase = {
//         userId,
//         productId,
//         quantity,
//         totalPrice
//     }
//     purchases.push(newPurchase)
//     console.log("Compra realizada com sucesso")
// }

// export function getAllPurchasesFromUserId(userIdToSearch: string) : TPurchase[] | undefined {
//     return(purchases.filter((purchase) => {
//         return(purchase.userId === userIdToSearch)
//     }))
// }