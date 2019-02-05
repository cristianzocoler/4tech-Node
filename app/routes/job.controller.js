const jobModel = require('../../models/job')
const {check,validationResult} = require('express-validator/check')
const validateToken = require('../../config/security/tokenValidator')

let collectionJobs = []

module.exports = routes => {

    const db = routes.config.firebaseConfig.collection('jobs')

    // MÉTODOS PARA FAZER AS REQUISIÇÕES ATRAVÉS DO FIREBASE

    //REQUISIÇÃO GET ALL
    routes.get('/jobs/', validateToken , async (req, res) => {
        try {
            let docs = await db.get()
            let jobs = []

            docs.forEach(doc => {
                jobs.push(extractJob(doc))
            })
            return res.send(jobs)

        } catch (error) {
            return res.status(500).send(error)
        }
    })

    // REQUISIÇÃO GET BY ID
    routes.get('/jobs/:id', async (req, res) => {
        try {
            let job = await db.doc(req.params.id).get()

            if (job.exists)
                return res.send(extractJob(job))
            else
                return res.status(404).send('Job not found')

        } catch (error) {
            return res.status(500).send(error)
        }
    })

    // REQUISIÇÃO PUT TO UPDATE
    routes.put('/jobs/:id', async (req, res) => {
        try {
            let job = await db.doc(req.params.id).update(req.body)

            if(job)
                return res.send(`A vaga ${req.params.id} foi atualizada com sucesso`)
            else
                return res.status(404).send('Job not found')

        } catch (error) {
            return res.status(500).send(error)
        }
    })

    // REQUISIÇÃO DELETE TO DELETE SOMETHING THAT WAS CREATED
    routes.delete('/jobs/:id', async (req, res) => {
        try {
            let deletedJob = await db.doc(req.params.id).delete()

            if (deletedJob)
                return res.send(`A vaga ${req.params.body} foi deletada`)
            else
                return res.status(404).send('Job Not Found')

        } catch (error) {
            return res.status(500).send(error)
        }
    })

    // REQUISIÇÃO POST TO CREATE
    routes.post('/jobs/', [check('name').isLength({ min: 5})], async (req, res) => {
        if (!validationResult(req).isEmpty())
            return res.status(422).send('Invalid Name')
            
        try {
            await db.doc().set(req.body)
            return res.send('Job added successfully')

        } catch (error) {
            return res.status(500).send(error)
        }
    })

    // Função para deixar a reposta do banco de dados "bonita"
    extractJob = job => {

        let v = job.data() // v = value, ou seja, ele quer o valor que está no db

        return {
            id: job.id,
            name: v.name,
            salary: v.salary,
            description: v.description,
            skills: v.skills,
            area: v.area,
            differentials: v.differentials,
            isPcd: v.isPcd,
            isActive: v.isActive

        }

    }
}