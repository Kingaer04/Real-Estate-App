import express from "express"
import {userController} from "../controllers/userController.js"

const router = express.Router()

router.get("/user", (req, res) => {
    res.json({message: 'Hello'})
})

export default router
