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
    res.status(200).send(users)
})

// GET ALL PRODUCTS

app.get('/products', (req: Request, res: Response) => {
    res.status(200).send(products)
})

// GET PRODUCTS BY QUERY

app.get('/products/search', (req: Request, res: Response) => {
    const q = req.query.q as string

    const response = products.filter((product) => {
        return product.name.toLowerCase().includes(q.toLowerCase())
    })

    res.status(200).send(response)
})

// CREATE USER

app.post('/users', (req: Request, res: Response) => {
    const {id, email, password} = req.body as TUser

    const newUser = {
        id,
        email,
        password
    }

    users.push(newUser)

    res.status(201).send('Cadastro realizado com sucesso.')
})

// CREATE PRODUCT

app.post('/products', (req: Request, res: Response) => {
    const {id, name, price, category} = req.body as TProduct

    const newProduct = {
        id,
        name,
        price,
        category
    }

    products.push(newProduct)

    res.status(201).send('Produto cadastrado com sucesso.')

})

// CREATE PURCHASE

app.post('/purchases', (req: Request, res: Response) => {
    const {userId, productId, quantity, totalPrice} = req.body as TPurchase

    const newPurchase = {
        userId,
        productId,
        quantity,
        totalPrice
    }

    purchases.push(newPurchase)

    res.status(201).send('Compra realizada com sucesso.')
})

// GET PRODUCTS BY ID

app.get('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id as string

    const result = products.filter((product) => {
        return product.id === id
    })

    res.status(200).send(result)
})

// GET USER PURCHASES BY ID

app.get('/users/:id/purchases', (req: Request, res: Response) => {
    const id = req.params.id as string

    const userPurchases = purchases.filter((purchase) => {
        return purchase.userId === id
    })

    res.status(200).send(userPurchases)
})

// DELETE USER BY ID

app.delete('/users/:id', (req: Request, res: Response) => {
    const id = req.params.id as string

    const userIndex = users.findIndex((user) => {
        return user.id === id
    })

    users.splice(userIndex, 1)

    res.status(200).send('User apagado com sucesso.')
})

// DELETE PRODUCT BY ID

app.delete('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id as string

    const productIndex = products.findIndex((product) => {
        return product.id === id
    })

    products.splice(productIndex, 1)

    res.status(200).send('Produto apagado com sucesso.')
})

// EDIT USER BY ID

app.put('/users/:id', (req: Request, res: Response) => {
    const id = req.params.id as string

    const newEmail = req.body.email as string | undefined
    const newPassword = req.body.password as string | undefined

    const userToBeEdited = users.find((user) => {
        return user.id === id
    })

    if(userToBeEdited){
        userToBeEdited.email = newEmail || userToBeEdited.email
        userToBeEdited.password = newPassword || userToBeEdited.password

        res.status(200).send('Cadastro atualizado com sucesso.')
    }

    res.status(404).send('Usuário não encontrado.')
})

// EDIT PRODUCT BY ID

app.put('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id as string

    const newName = req.body.name as string | undefined
    const newPrice = req.body.price as number | undefined
    const newCategory = req.body.category as PRODUCT_CATEGORIES | undefined

    const productToBeEdited = products.find((product) => {
        return product.id === id
    })

    if(productToBeEdited){
        productToBeEdited.name = newName || productToBeEdited.name
        productToBeEdited.price = newPrice || productToBeEdited.price
        productToBeEdited.category = newCategory || productToBeEdited.category

        res.status(200).send('Produto atualizado com sucesso.')
    }

    res.status(404).send('Produto não encontrado.')
})