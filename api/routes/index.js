import express from "express"
import userRouter from "./userRoute.js"


const router = express.Router()

router.get("/", userRouter)

export default router
