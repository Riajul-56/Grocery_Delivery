import mongoose from "mongoose";

interface IUser {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    mobile: string;
    role: 'user' | 'admin' | 'deliveryBoy';
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true }, 
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'deliveryBoy'], default: 'user' }
}, { timestamps: true });