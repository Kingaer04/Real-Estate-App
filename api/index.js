import express from 'express'
import mongoose from 'mongoose'
import layouts from "express-ejs-layouts"
import dotenv from 'dotenv'
import router from './routes/index.js'
import userRoute from './routes/userRoute.js'
import session from "express-session" // for cookie session
import cookieParser from "cookie-parser"
import connectFlash from "connect-flash" // for the flash message
import passport from 'passport'
import User from './models/user.js'


dotenv.config()

const app = express()

app.use(cookieParser("secret_passcode"))
app.use(session({
    secret: "secret_passcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,  // Ensure the cookie is httpOnly for security
        secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
        maxAge: 3600000  // 1 hour
    }
}));app.use(connectFlash())
app.use((req,res, next) =>{
    res.locals.flashMessages = req.flash()
    res.locals.user = req.user
    next()
})
app.use(passport.initialize())
app.use(passport.session()) // Passport to use session that has been setup
passport.use(User.createStrategy()) // configure the user's login strategy
passport.serializeUser(User.serializeUser()) // for encrypting
passport.deserializeUser(User.deserializeUser()) //for decrypting

app.set("view engine", "ejs")
app.use(layouts)
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const db = mongoose.connection
mongoose.connect(process.env.MONGO)

db.once("open", () => {
    console.log("Database connected succesfully!")
})

app.set('port', process.env.PORT || 3000)

app.use('/', router)
app.use((error, req, res, next) =>  {
    const errorCode = error.errorCode || 500
    const message = error.message || 'Internal Server Error'
    return res.status(errorCode).json({
        success: false,
        errorCode,
        message,
})})

app.listen(app.get('port'), () => {
    console.log(`Server is running on https://localhost/${app.get('port')}`)
})
