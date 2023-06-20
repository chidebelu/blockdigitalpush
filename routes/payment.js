import express from "express"
import {getAllWithdrawalRequests, saveWithdrawalRequest, getUserWithdrawalList,
     deleteWithdrawalRequests, adminUpdateSingleUserWithdrawalRequest } from "../controllers/paymentController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const route = express.Router()

route.post("/withdrawal", protect, saveWithdrawalRequest)
route.get("/withdrawal/:id", protect, getUserWithdrawalList)
route.get("/withdrawal", protect, admin, getAllWithdrawalRequests)
route.delete("/withdrawal/:id", protect, admin, deleteWithdrawalRequests)
route.put("/withdrawal/:id", protect, admin, adminUpdateSingleUserWithdrawalRequest)


export default route