import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import router from './routes/index.js'
import userRoute from './routes/userRoute.js'

dotenv.config()

const app = express()

const db = mongoose.connection
mongoose.connect(process.env.MONGO)

db.once("open", () => {
    console.log("Database connected succesfully!")
})

app.set('port', process.env.PORT || 3000)

app.use('/', userRoute)

app.listen(app.get('port'), () => {
    console.log(`Server is running on https://localhost/${app.get('port')}`)
})
