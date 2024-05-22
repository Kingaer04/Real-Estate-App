import mongoose from "mongoose"
import passportLocalMoongoose from 'passport-local-mongoose'

const userSchemma = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Free-Download.png"
    } 
}, {timestamps: true})

userSchemma.plugin(passportLocalMoongoose, {
    usernameField: "email"
})

const User = mongoose.model('User', userSchemma)

export default User
