import { TUser, TProduct, TPurchase, PRODUCT_CATEGORIES } from './types';
import { users, products, purchases } from './database';
import express, {Request, Response} from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log('Servidor rodando na porta 3003.')
})

// ENDPOINT DE TESTE

app.get('/ping', (req: Request, res: Response) => {
    res.status(200).send('Pong!')
})


// GET ALL USERS

app.get('/users', (req: Request, res: Response) => {
    try{
        res.status(200).send(users)

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        res.send(error.message)
    }
    
})

// GET ALL PRODUCTS

app.get('/products', (req: Request, res: Response) => {
    try{
        res.status(200).send(products)

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        res.send(error.message)
    }    
})

// GET PRODUCTS BY NAME

app.get('/products/search', (req: Request, res: Response) => {
    try{
        const q = req.query.q

        if(typeof q === "string"){
            if(q.length < 1){
                res.status(400)
                throw new Error("A pesquisa deve conter pelo menos um caractere.")
            }

            const result = products.filter((product) => {
                return product.name.toLowerCase().includes(q.toLowerCase())
            })

            if(result.length === 0){
                res.status(200).send("Produto não encontrado.")
            }
    
            res.status(200).send(result)
        }       

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        res.send(error.message)
    }
    
})

// CREATE USER

app.post('/users', (req: Request, res: Response) => {
    try{
        const {id, email, password} = req.body

        if(
            typeof req.body.id !== "string" ||
            typeof req.body.email !== "string" ||
            typeof req.body.password !== "string"){
            res.status(400)
            throw new Error("'body' inválido. Todos os campos devem estar no formato 'string'.")
        }

        const findId = users.find((user) => {
            return user.id === req.body.id})        

        if(findId){
            res.status(400)
            throw new Error("'id' de usuário já consta na base de dados.")
        }

        const findEmail = users.find((user) => {
            return user.email === req.body.email})

        if(findEmail){
            res.status(400)
            throw new Error("'email' já consta na base de dados.")
        }

        const newUser: TUser = {
            id,
            email,
            password
        }

        users.push(newUser)

        res.status(201).send('Cadastro realizado com sucesso.')

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        res.send(error.message)
    }       
})

// CREATE PRODUCT

app.post('/products', (req: Request, res: Response) => {
    try{
        const {id, name, price, category} = req.body

        if(typeof req.body.id !== "string"){
            res.status(400)
            throw new Error("'id' inválido. Deve estar no formato 'string'.")
        }

        const findId = products.find((product) => {
            return product.id === req.body.id})   

        if(findId){
            res.status(400)
            throw new Error("'id' de produto já consta na base de dados.")
        }

        if(typeof req.body.name !== "string"){
            res.status(400)
            throw new Error("'name' inválido. Deve estar no formato 'string'.")
        }

        if(typeof req.body.price !== "number"){
            res.status(400)
            throw new Error("'price' inválido. Deve estar no formato 'number'.")
        }

        if(typeof req.body.category !== "string"){
            res.status(400)
            throw new Error("'category' inválido. Deve estar no formato 'string'.")
        }

        const newProduct: TProduct = {
            id,
            name,
            price,
            category
        }

        products.push(newProduct)

        res.status(201).send('Produto cadastrado com sucesso.')

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        res.send(error.message)
    }
})

// CREATE PURCHASE

app.post('/purchases', (req: Request, res: Response) => {
    try{
        const {userId, productId, quantity, totalPrice} = req.body

        if(typeof req.body.userId !== "string"){
            res.status(400)
            throw new Error("'userId' inválido. Deve estar no formato 'string'.")
        }

        const findId = users.find((user) => {
            return user.id === req.body.userId
        })        

        if(!findId){
            res.status(404)
            throw new Error("'id' de usuário não encontrado.")
        }

        if(typeof req.body.productId !== "string"){
            res.status(400)
            throw new Error("'productId' inválido. Deve estar no formato 'string'.")
        }

        const findProduct = products.find((product) => {
            return product.id === req.body.productId})        

        if(!findProduct){
            res.status(404)
            throw new Error("'id' de produto não encontrado.")
        }

        if(typeof req.body.quantity !== "number"){
            res.status(400)
            throw new Error("'quantity' inválido. Deve estar no formato 'number'.")
        }

        if(typeof req.body.totalPrice !== "number"){
            res.status(400)
            throw new Error("'totalPrice' inválido. Deve estar no formato 'number'.")
        }

        const newPurchase: TPurchase = {
            userId,
            productId,
            quantity,
            totalPrice
        }

        purchases.push(newPurchase)

        res.status(201).send('Compra realizada com sucesso.')

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        res.send(error.message)
    }    
})

// GET PRODUCTS BY ID

app.get('/products/:id', (req: Request, res: Response) => {
    try{
        const id = req.params.id

        const result = products.filter((product) => {
            return product.id === id
        })

        if(result.length === 0){
            res.status(404).send("Produto não encontrado.")
        } else {
            res.status(200).send(result)
        }        

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        res.send(error.message)
    }    
})

// GET USER PURCHASES BY ID

app.get('/users/:id/purchases', (req: Request, res: Response) => {
    try{
        const id = req.params.id

        const userPurchases = purchases.filter((purchase) => {
            return purchase.userId === id
        })

        if(userPurchases.length === 0){
            res.status(404).send("Nenhuma compra foi encontrada para o 'id' de usuário informado.")
        } else {
            res.status(200).send(userPurchases)
        }  

        res.status(200).send(userPurchases)

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        res.send(error.message)
    }       
})

// DELETE USER BY ID

app.delete('/users/:id', (req: Request, res: Response) => {
    try {
        const id = req.params.id 

        const userIndex = users.findIndex((user) => {
            return user.id === id
        })

        if(userIndex < 0){
            res.status(404)
            throw new Error("Usuário não encontrado.")
        } else {
            users.splice(userIndex, 1)

            res.status(200).send('User apagado com sucesso.')
        }        

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        res.send(error.message)
    }     
})

// DELETE PRODUCT BY ID

app.delete('/products/:id', (req: Request, res: Response) => {
    try{
        const id = req.params.id

        const productIndex = products.findIndex((product) => {
            return product.id === id
        })

        if(productIndex < 0){
            res.status(404)
            throw new Error("Produto não encontrado.")
        } else {
            products.splice(productIndex, 1)

            res.status(200).send('Produto apagado com sucesso.')
        }         

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        res.send(error.message)
    }     
})

// EDIT USER BY ID

app.put('/users/:id', (req: Request, res: Response) => {
    try {
        const id = req.params.id 

        const userToBeEdited = users.find((user) => {
            return user.id === id
        })

        if(!userToBeEdited){
            res.status(404)
            throw new Error("Usuário não encontrado.")
        }

        const newEmail = req.body.email 

        if(
            typeof newEmail !== "string" &&
            typeof newEmail !== "undefined"){
            res.status(400)
            throw new Error("'email' inválido. Deve estar no formato 'string'.")
        }

        const newPassword = req.body.password

        if(
            typeof newPassword !== "string" &&
            typeof newPassword !== "undefined"){
            res.status(400)
            throw new Error("'password' inválido. Deve estar no formato 'string'.")
        }       

        if(userToBeEdited){
            userToBeEdited.email = newEmail || userToBeEdited.email
            userToBeEdited.password = newPassword || userToBeEdited.password

            res.status(200).send('Cadastro atualizado com sucesso.')
        }        

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        res.send(error.message)
    }    
})

// EDIT PRODUCT BY ID

app.put('/products/:id', (req: Request, res: Response) => {
    try{
        const id = req.params.id

        const productToBeEdited = products.find((product) => {
            return product.id === id
        })

        if(!productToBeEdited){
            res.status(404)
            throw new Error("Produto não encontrado.")
        }

        const newName = req.body.name

        if(
            typeof newName !== "string" &&
            typeof newName !== "undefined"){
            res.status(400)
            throw new Error("'name' inválido. Deve estar no formato 'string'.")
        }

        const newPrice = req.body.price 

        if(
            typeof newPrice !== "number" &&
            typeof newPrice !== "undefined"){
            res.status(400)
            throw new Error("'price' inválido. Deve estar no formato 'number'.")
        }

        const newCategory = req.body.category      
        
        if(typeof newCategory !== "undefined"){
            if( newCategory !== PRODUCT_CATEGORIES.ACCESSORIES &&
                newCategory !== PRODUCT_CATEGORIES.CLOTHES_AND_SHOES &&
                newCategory !== PRODUCT_CATEGORIES.ELECTRONICS){
                    res.status(400)
                    throw new Error("'category' inválido. Deve ser 'Acessórios', 'Roupas e Calçados' ou 'Eletrônicos'.")
                }           
        }

        if(productToBeEdited){
            productToBeEdited.name = newName || productToBeEdited.name
            productToBeEdited.price = newPrice || productToBeEdited.price
            productToBeEdited.category = newCategory || productToBeEdited.category

            res.status(200).send('Produto atualizado com sucesso.')
        }        

    } catch (error: any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }

        res.send(error.message)
    }     
})