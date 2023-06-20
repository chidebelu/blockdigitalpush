import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    },

    firstname: {
        type: String,
        required: [true, "Enter Your First Name"]
    },

    email:{
        type: String,
        required: [true, "Enter Your Email Address"]
    },
    plan:{
        type: String,
        required: [true, "Enter The Plan You Deposited With"]
    },

    method:{
        type: String,
        required: [true, "Enter The Method You Deposited With"]
    },
    amount:{
        type: Number,
        required: [true, "Enter Amount"]
    },
    status:{
        type: String,
        default: "Pending"
    },
    date:{
        type: String,
        required: [true]
    }



    
})

export default mongoose.model("Payment", paymentSchema)