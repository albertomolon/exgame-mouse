import mongoose from "mongoose"; 

interface IUser {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    image: number;
    created_at: Date;
    updated_at: Date;
    role: "user" | "teacher" | "admin"; 
    data: any;
}

const userSchema = new mongoose.Schema<IUser>({
    _id: {type: String, required: true, unique: true},
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    role: { type: String, enum: ["user", "teacher", "admin"], default: "user" },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
});

export const userModel = mongoose.model<IUser>("User", userSchema);

export default IUser;