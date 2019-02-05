const jwt = require("jsonwebtoken")
const db = require('../../config/firebaseConfig')
const secretKey = require('../../config/secretKey')

const validateToken = (req, res, next) => {
    let token = req.headers['authorization']
}

module.exports = routes => {

    const db = routes.config.firebaseConfig.collection('users')

    routes.post('/login', async (req, res) => {
        try {
            let data = await db.get()
            let filteredUser = data.docs.find(doc => {
                let user = doc.data()
                return user.email == req.body.email && user.password == req.body.password
            })

            if (filteredUser) {
                filteredUser = extractUser(filteredUser)
                let id = filteredUser.id
                const token = jwt.sign({
                    id
                }, 
                    secretKey
                )
                res.send({
                    auth: true,
                    token: token,
                    user: filteredUser
                })
            } else
                return res.status(404).send({
                    auth: false,
                    message: 'User not found'
                })
        } catch (error) {
            res.status(500).send(error)
        }
    })

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