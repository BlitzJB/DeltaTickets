import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { sanitizeUser } from "~/utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" })
    }
    const client = new PrismaClient();

    const session = await client.session.findFirst({
        where: {
            token: req.cookies.session
        }
    });

    if (!session) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const user = await client.user.findUnique({
        where: {
            id: session.userId
        }
    });

    res.status(200).json({user: sanitizeUser(user)})
}