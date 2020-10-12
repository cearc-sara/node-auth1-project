const router = require("express").Router()
const bcryptjs = require("bcryptjs")
const Users = require("../users/users-model")

// /auth/register
router.post("/register", (req, res) => {
    const credentials = req.body
    const rounds = Number(process.env.HASH_ROUNDS) || 8
    const hash = bcryptjs.hashSync(credentials.password, rounds)

    credentials.password = hash

    Users.add(credentials)
    .then(user => {
        res.status(201).json({ data: user })
    })
    .catch(err => res.send({ error: err.message }))
})

// /auth/login
router.post("/login", (req, res) => {
    const credentials = req.body

    Users.findBy({username: credentials.username})
    .then(users => {
        const user = users[0]
        if(user && bcryptjs.compareSync(credentials.password, user.password)){
            req.session.username = user.username
            res.status(201).json({message: "Greetings young Hobbits", username: req.username})
        }else{
            res.status(401).json({message: "invalid credentials"})
        }
    })
    .catch(err => res.send({error: err.message}))
})

router.get("/logout", (req, res) => {
    if(req.session){
        req.session.destroy(err => {
            if(err){
                res.status(500).json({ message: "logout failed, please try again"})
            }else{
                res.status(204).end()
            }
        })
    }else{
        res.status(204).end()
    }
})

module.exports = router