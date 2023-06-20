import mongoose from "mongoose";

const sharpSchema = mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    plann: {
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    method:  {
        type: String,
        required: true
    },
    status:  {
        type: String,
        default: "Pending"
    }
})

export default mongoose.model("Sharp", sharpSchema)