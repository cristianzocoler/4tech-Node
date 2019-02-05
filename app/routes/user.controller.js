const userModel = require('../../models/user')
const {check,validationResult} = require('express-validator/check')
const validateToken = require('../../config/security/tokenValidator')

let collectionUsers = []

module.exports = routes => {

    const db = routes.config.firebaseConfig.collection('users')

    // MÉTODOS PARA FAZER AS REQUISIÇÕES ATRAVÉS DO FIREBASE

    //REQUISIÇÃO GET ALL
    routes.get('/users/', validateToken , async (req, res) => {
        try {
            let docs = await db.get()
            let users = []

            docs.forEach(doc => {
                users.push(extractUser(doc))
            })
            return res.send(users)

        } catch (error) {
            return res.status(500).send(error)
        }
    })

    // REQUISIÇÃO GET BY ID
    routes.get('/users/:id', async (req, res) => {
        try {
            let user = await db.doc(req.params.id).get()

            if (user.exists)
                return res.send(extractUser(user))
            else
                return res.status(404).send('User not found')

        } catch (error) {
            return res.status(500).send(error)
        }
    })

    // REQUISIÇÃO PUT TO UPDATE
    routes.put('/users/:id', async (req, res) => {
        try {
            let user = await db.doc(req.params.id).update(req.body)

            if(user)
                return res.send(`O user ${req.params.id} foi atualizado com sucesso`)
            else
                return res.status(404).send('User not found')

        } catch (error) {
            return res.status(500).send(error)
        }
    })

    // REQUISIÇÃO DELETE TO DELETE SOMETHING THAT WAS CREATED
    routes.delete('/users/:id', async (req, res) => {
        try {
            let deletedUser = await db.doc(req.params.id).delete()

            if (deletedUser)
                return res.send(`O usuário ${req.params.body} foi deletado`)
            else
                return res.status(404).send('User Not Found')

        } catch (error) {
            return res.status(500).send(error)
        }
    })

    // REQUISIÇÃO POST TO CREATE
    routes.post('/users/', [check('name').isLength({ min: 5})], async (req, res) => {
        if (!validationResult(req).isEmpty())
            return res.status(422).send('Invalid Name')
            
        try {
            await db.doc().set(req.body)
            return res.send('User added successfully')

        } catch (error) {
            return res.status(500).send(error)
        }
    })

    // Função para deixar a reposta do banco de dados "bonita"
    extractUser = user => {

        let v = user.data() // v = value, ou seja, ele quer o valor que está no db

        return {
            id: user.id,
            name: v.name,
            email: v.email,
            password: v.email
        }

    }
}