import express from "express"
import userRouter from "./userRoute.js"
import authRouter from "./authRoute.js"


const router = express.Router()

router.use("/user", userRouter)
router.use("/signUp", authRouter)

export default router
