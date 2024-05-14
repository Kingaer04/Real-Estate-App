import mongoose from "mongoose";

const userSchemma = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true})

const User = mongoose.model('User', userSchemma)

export default User
