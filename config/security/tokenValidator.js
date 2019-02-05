const jwt = require("jsonwebtoken")
const db = require('../firebaseConfig')
const secretKey = require('../secretKey')

const validateToken = (req, res, next) => {
    let token = req.headers['authorization']

    if (!token)
        return res.status(401).send({
            auth: false,
            message: 'No token provided'
        })
    if (token.split(' ')[0] != 'Bearer')
        return res.status(401).send({
            auth: false,
            message: token.split(' ')
        })


    jwt.verify(token.split(' ')[1], secretKey, async (error, decoded) => {
        if (error)
            return res.status(500).send({
                auth: false,
                message: 'Failed to decode'
            })

        let data = await db.collection('users').get()
        
        data.docs.find(user => {
            if (user.id == decoded.id)
                return next()
        })  
    })
}

module.exports = validateToken