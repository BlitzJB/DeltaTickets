import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { hashPassword, sanitizeUser } from "~/utils/auth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" })
    }
    const client = new PrismaClient();

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" })
    }

    const existingUser = await client.user.findFirst({
        where: {
            email
        }
    });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
    }

    const user = await client.user.create({
        data: {
            name,
            email,
            password: hashPassword(password)
        }
    });

    const session = await client.session.create({
        data: {
            userId: user.id
        }
    });

    res.setHeader("Set-Cookie", `session=${session.token}; HttpOnly; Path=/; Max-Age=31536000; SameSite=Strict; Secure`);
    res.status(200).json({user: sanitizeUser(user)})

}