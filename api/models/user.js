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
    }
}, {timestamps: true})

userSchemma.plugin(passportLocalMoongoose, {
    usernameField: "email"
})

const User = mongoose.model('User', userSchemma)

export default User
