import {Request, Response} from 'express'

require('dotenv').config()
require('express-async-errors');

const sequelize = require('./db/connect')
const express = require('express')
const app = express()

app.get('/', (req: Request, res: Response) => {
    (res as any).send('meow')
})

const PORT = process.env.PORT

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()
