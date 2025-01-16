import dbConnect from "@/util/dbConnect";
import User from "../../../models/UserModel";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface User extends Document {
    _id: string;
    email: string;
    password: string;
}

const JWT_SECERT = process.env.NEXT_JWT_SECRET || "";
const token_expiery = '1h';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        const { email, password } = req.body;
        console.log('====================================');
        console.log(await bcrypt.hash('Seniru\'s Portfolio 2024', 10));
        console.log('====================================');

        if (!email || !password) {
            return res.status(405).json({ success: false, message: "Both email and password are required."})        
        }

        try {
            await dbConnect();
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, message: "Invalid username" });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: "Invalid Password" });
            }
            const token = jwt.sign(
                { id: user._id, email: user.email }, JWT_SECERT, { expiresIn: token_expiery }
            );

            return res.status(200).json({
                success: true,
                message: "Login Successful",
                token
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error during Login...", error.message);
            } else {
                console.error("Error during Login...", error);
            }
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

export default handler;