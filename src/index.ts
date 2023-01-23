import { TUser, TProduct, TPurchase, PRODUCT_CATEGORIES } from "./types"
import { users, products, purchases } from "./database"
import express, {Request, Response} from "express"
import cors from "cors"
import knex from "knex"

export const db = knex({
    client:"sqlite3",
    connection:{
        filename: "./src/database/newLabecommerce.db"
    },
    useNullAsDefault: true,
    pool:{
        min:0,
        max:1
    }
})

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

app.get('/users', async (req: Request, res: Response) => {
    try{
        const result = await db.raw(`
            SELECT * FROM users;
        `)

        res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }    
})

// GET ALL PRODUCTS

app.get('/products', async (req: Request, res: Response) => {
    try{
        const result = await db.raw(`
            SELECT * FROM products;
        `)

        res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }    
})

// GET PRODUCTS BY NAME

app.get('/products/search', async (req: Request, res: Response) => {
    try{
        const q = req.query.q

        if(typeof q === "string"){
            if(q.length < 1){
                res.status(400)
                throw new Error("A pesquisa deve conter pelo menos um caractere.")
            }

            const result = await db.raw(`
                SELECT * FROM products
                WHERE name LIKE "%${q}%";
            `)

            if(result.length === 0){
                res.status(200).send("Produto não encontrado.")
            }
    
            res.status(200).send(result)
        }       

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }     
})

// CREATE USER

app.post('/users', async (req: Request, res: Response) => {
    try{
        const {id, name, email, password} = req.body

        if(
            typeof req.body.id !== "string" ||
            typeof req.body.name !== "string" ||
            typeof req.body.email !== "string" ||
            typeof req.body.password !== "string"){
            res.status(400)
            throw new Error("'body' inválido. Todos os campos devem estar no formato 'string'.")
        }

        const [findId] = await db.raw(`
            SELECT * FROM users
            WHERE id = "${req.body.id}";
        `)       

        if(findId){
            res.status(400)
            throw new Error("'id' de usuário já consta na base de dados.")
        }

        const [findEmail] = await db.raw(`
            SELECT * FROM users
            WHERE email = "${req.body.email}";
        `) 

        if(findEmail){
            res.status(400)
            throw new Error("'email' já consta na base de dados.")
        }

        const created_at = Date()

        const newUser: TUser = {
            id,
            name,
            email,
            password,
            created_at            
        }       

        await db.raw(`
            INSERT INTO users (id, name, email, password, created_at)
            VALUES
                ("${newUser.id}", "${newUser.name}", "${newUser.email}", "${newUser.password}", "${newUser.created_at}");
        `)

        res.status(201).send('Cadastro realizado com sucesso.')

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }       
})

// CREATE PRODUCT

app.post('/products', async (req: Request, res: Response) => {
    try{
        const {id, name, price, category} = req.body

        if(typeof req.body.id !== "string"){
            res.status(400)
            throw new Error("'id' inválido. Deve estar no formato 'string'.")
        }

        const [findId] = await db.raw(`
            SELECT * FROM products
            WHERE id = "${req.body.id}";
        `)    

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

        await db.raw(`
            INSERT INTO products (id, name, price, category)
            VALUES
                ("${newProduct.id}", "${newProduct.name}", ${newProduct.price}, "${newProduct.category}");
        `)

        res.status(201).send('Produto cadastrado com sucesso.')

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    } 
})

// CREATE PURCHASE

app.post('/purchases', async (req: Request, res: Response) => {
    try{
        const {id, total_price, paid, delivered_at, buyer_id} = req.body

        if(typeof req.body.id !== "string"){
            res.status(400)
            throw new Error("'id' inválido. Deve estar no formato 'string'.")
        }        

        const [findId] = await db.raw(`
            SELECT * FROM purchases
            WHERE id = "${req.body.id}";
        `)    

        if(findId){
            res.status(400)
            throw new Error("'id' de compra já consta na base de dados.")
        }

        if(typeof req.body.total_price !== "number"){
            res.status(400)
            throw new Error("'total_price' inválido. Deve estar no formato 'number'.")
        }       

        if(typeof req.body.paid !== "number"){
            res.status(400)
            throw new Error("'paid' inválido. Deve estar no formato 'number' (0 ou 1).")
        }

        if(typeof req.body.buyer_id !== "string"){
            res.status(400)
            throw new Error("'buyer_id' inválido. Deve estar no formato 'string'.")            
        }

        const [findBuyerId] = await db.raw(`
            SELECT * FROM users
            WHERE id = "${req.body.buyer_id}";
        `)       

        if(!findBuyerId){
            res.status(404)
            throw new Error("'buyer_id' não encontrada.")
        }

        const newPurchase: TPurchase = {
            id,
            total_price,
            paid,
            delivered_at,
            buyer_id
        }

        await db.raw(`
            INSERT INTO purchases (id, total_price, paid, buyer_id)
            VALUES
                ("${newPurchase.id}", ${newPurchase.total_price}, ${paid}, "${newPurchase.buyer_id}")
        `)

        res.status(201).send('Compra realizada com sucesso.')

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }     
})

// GET PRODUCTS BY ID

app.get('/products/:id', async (req: Request, res: Response) => {
    try{
        const id = req.params.id

        if(id.length < 4){
            res.status(400)
            throw new Error("'id' de produto inválida. Deve conter pelo menos quatro caracteres.")
        } 
        
        if(id[0] !== "p"){
            res.status(400)
            throw new Error("'id' de produto inválida. Deve iniciar com a letra 'p'.")
        }

        const result = await db.raw(`
            SELECT * FROM products
            WHERE id = "${id}";
        `)

        if(result.length === 0){
            res.status(404).send("Produto não encontrado.")
        } else {
            res.status(200).send(result)
        }        

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }     
})

// GET USER PURCHASES BY ID

app.get('/users/:id/purchases', async (req: Request, res: Response) => {
    try{
        const id = req.params.id

        if(id.length < 4){
            res.status(400)
            throw new Error("'id' de usuário inválida. Deve conter pelo menos quatro caracteres.")
        } 
        
        if(id[0] !== "u") {
            res.status(400)
            throw new Error("'id' de usuário inválida. Deve iniciar com a letra 'u'.")
        }

        const userPurchases = await db.raw(`
            SELECT * FROM purchases
            WHERE buyer_id = "${id}";
        `)

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
                newCategory !== PRODUCT_CATEGORIES.GAMES &&
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