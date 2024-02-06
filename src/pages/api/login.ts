import { NextApiRequest, NextApiResponse } from "next"; 
import { PrismaClient } from "@prisma/client";
import { sanitizeUser, verifyPassword } from "~/utils/auth";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" })
    }
    const client = new PrismaClient();

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields" })
    }

    const user = await client.user.findFirst({
        where: {
            email
        }
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    if (!verifyPassword(password, user.password)) {
        return res.status(401).json({ message: "Invalid password" })
    }

    const session = await client.session.create({
        data: {
            userId: user.id
        }
    });

    res.setHeader("Set-Cookie", `session=${session.token}; HttpOnly; Path=/; Max-Age=31536000; SameSite=Strict; Secure`);
    res.status(200).json({user: sanitizeUser(user)})

}