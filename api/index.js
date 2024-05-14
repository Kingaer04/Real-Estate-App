import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
// mongoose.connect(
//     "mongodb://localhost:27017/EccaLagos",
//     {useNewUrlParser:true}
// )

// const db = mongoose.connection
// db.once("open", ()=>{
//     console.log("Connected Successfully") // return a message to the terminal
// })

const db = mongoose.connection
mongoose.connect(process.env.MONGO)

db.once("open", () => {
    console.log("Database connected succesfully!")
})

app.set('port', process.env.PORT || 3000)

app.get("/", (req, res) => {
    res.send("Hi")
})

app.listen(app.get('port'), () => {
    console.log(`Server is running on https://localhost/${app.get('port')}`)
})
