const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)

const usersRouter = require("../users/users-router")
const authRouter = require("../auth/auth-router")
const protected = require("../auth/protected-mw")
const connection = require("../data/connection")

const server = express()

const sessionConfiguration = {
    name: "Gandalf",
    secret: process.env.SESSION_SECRET || "keep it secret, keep it safe",
    cooke: {
        httpOnly: true,
        maxAge: 1000 * 60 * 10,
        secure: process.env.SECURE_COOKIES || false,
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: connection,
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
}

server.use(helmet())
server.use(express.json())
server.use(cors())
server.use(session(sessionConfiguration))

server.use("/api/auth", authRouter)
server.use("/api/users", protected, usersRouter)

server.get("/", (req, res) => {
    res.json({ api: "up and running", session: req.session })
})

module.exports = server