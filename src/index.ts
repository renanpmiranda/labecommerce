import { TUser, TProduct, TPurchase } from "./types"
import express, {Request, Response} from "express"
import cors from "cors"
import { db } from "./database/knex"

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
        const result = await db("users")       

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
        const result = await db("products")

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

            const result = await db("products").where("name", "LIKE", `%${q}%`)

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

        const [findId] = await db("users").where({id: req.body.id})
        
        if(findId){
            res.status(400)
            throw new Error("'id' de usuário já consta na base de dados.")
        }

        const [findEmail] = await db("users").where({email: req.body.email})
        
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

        await db("users").insert(newUser)        

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
        const {id, name, price, description, imageUrl} = req.body

        if(typeof req.body.id !== "string"){
            res.status(400)
            throw new Error("'id' inválido. Deve estar no formato 'string'.")
        }

        const [findId] = await db("products").where({id})    

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

        if(typeof req.body.description !== "string"){
            res.status(400)
            throw new Error("'description' inválido. Deve estar no formato 'string'.")
        }

        if(typeof req.body.imageUrl !== "string"){
            res.status(400)
            throw new Error("'imageUrl' inválido. Deve estar no formato 'string'.")
        }

        const newProduct: TProduct = {
            id,
            name,
            price,
            description,
            image_url: imageUrl
        }

        await db("products").insert(newProduct)

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

// DELETE USER BY ID

app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id 

        const [userExists] = await db("users").where({id: idToDelete})

        if(!userExists){
            res.status(404)
            throw new Error("Usuário não encontrado.")
        }

        await db("users").del().where({id: idToDelete})

        res.status(200).send('User apagado com sucesso.')            

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

// DELETE PRODUCT BY ID

app.delete('/products/:id', async (req: Request, res: Response) => {
    try{
        const idToDelete = req.params.id

        const [productExists] = await db("products").where({id: idToDelete})

        if(!productExists){
            res.status(404)
            throw new Error("Produto não encontrado.")
        } 

        await db("products").del().where({id: idToDelete})

        res.status(200).send('Produto deletado com sucesso.')             

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

// EDIT USER BY ID

app.put('/users/:id', async (req: Request, res: Response) => {
    try {
        const idToBeEdited = req.params.id 

        const [userExists] = await db("users").where({id: idToBeEdited}) 

        if(!userExists){
            res.status(404)
            throw new Error("'id' de usuário não encontrada.")
        }

        const newName = req.body.name

        if(newName !== undefined){
            if(typeof newName !== "string"){
                res.status(400)
                throw new Error("'name' inválido. Deve estar no formato 'string'.")
            }
        }

        const newEmail = req.body.email         

        if(newEmail !== undefined){            

            if(typeof newEmail !== "string"){
                res.status(400)
                throw new Error("'email' inválido. Deve estar no formato 'string'.")
            }

            const [emailExists] = await db("users").where({email: newEmail})

            if(emailExists){
                res.status(400)
                throw new Error("'email' já consta na base de dados.")
            }
        }               

        const newPassword = req.body.password

        if(newPassword !== undefined){
            if(typeof newPassword !== "string"){
                res.status(400)
                throw new Error("'password' inválido. Deve estar no formato 'string'.")
            }
        }                

        if(userExists){
            await db("users").update({
                name: newName || userExists.name,
                email: newEmail || userExists.email,
                password: newPassword || userExists.password 
            }).where({id: idToBeEdited})
            res.status(200).send('Cadastro atualizado com sucesso.')
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

// EDIT PRODUCT BY ID

app.put('/products/:id', async (req: Request, res: Response) => {
    try{
        const idToBeEdited = req.params.id

        const [productExists] = await db("products").where({id: idToBeEdited})

        if(!productExists){
            res.status(404)
            throw new Error("'id' de produto não encontrada.")
        }

        const newName = req.body.name

        if(newName !== undefined){
            if(typeof newName !== "string"){
                res.status(400)
                throw new Error("'name' inválido. Deve estar no formato 'string'.")
            }
        }           

        const newPrice = req.body.price 

        if(newPrice !== undefined){
            if(typeof newPrice !== "number"){
                res.status(400)
                throw new Error("'price' inválido. Deve estar no formato 'number'.")
            }
        }             

        const newDescription = req.body.description

        if(newDescription !== undefined){
            if(typeof newDescription !== "string"){
                res.status(400)
                throw new Error("'description' inválido. Deve estar no formato 'string'.")
            }
        } 

        const newImageUrl = req.body.imageUrl

        if(newImageUrl !== undefined){
            if(typeof newImageUrl !== "string"){
                res.status(400)
                throw new Error("'imageUrl' inválido. Deve estar no formato 'string'.")
            }
        } 

        if(productExists){
            await db("products").update({
                name: newName || productExists.name,
                price: newPrice || productExists.price,
                description: newDescription || productExists.description,
                image_url: newImageUrl || productExists.image_url
            }).where({id: idToBeEdited})           

            res.status(200).send('Produto atualizado com sucesso.')
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

// GET PURCHASE BY ID

app.get("/purchases/:id", async (req: Request, res: Response) => {
    try {
        const purchaseId = req.params.id

        const [purchaseExists] = await db("purchases").where({id: purchaseId})

        if(!purchaseExists){
            res.status(404)
            throw new Error("'id' da compra não encontrada.")
        }         

        const result = await db("purchases").select(
                "purchases.id AS purchaseId",
                "total_price AS totalPrice",
                "paid AS isPaid",
                "buyer_id AS buyerId",
                "users.email",
                "users.name"
                )
                .where({purchaseId})                                           
                .innerJoin("users", "purchases.buyer_id", "=", "users.id")                          
                       
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

// DELETE PURCHASE BY ID
app.delete('/purchases/:id', async (req: Request, res: Response) => {
    try{
        const idToDelete = req.params.id

        const [purchaseExists] = await db("purchases").where({id: idToDelete})

        if(!purchaseExists){
            res.status(404)
            throw new Error("Pedido não encontrado.")
        } 

        await db("purchases").del().where({id: idToDelete})

        res.status(200).send('Pedido deletado com sucesso.')             

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