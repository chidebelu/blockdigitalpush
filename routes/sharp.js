import express from "express"
import {saveInvestment, getInvestment, getAllDepositsList, deleteInvestment} from "../controllers/sharpController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const route = express.Router()

route.post("/invested", protect, saveInvestment )
route.get("/invested/:id", protect, getInvestment )
route.get("/deposit", protect, admin, getAllDepositsList)
route.delete("/:id", protect, deleteInvestment)

export default route