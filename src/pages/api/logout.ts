import { NextApiRequest, NextApiResponse } from "next"; 
import { PrismaClient } from "@prisma/client";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = new PrismaClient();

    const session = await client.session.findFirst({
        where: {
            token: req.cookies.session ?? ""
        }
    });

    if (!session) {
        return res.status(200).json({ message: "Not Logged In" })
    }

    const deletedSession = await client.session.delete({
        where: {
            token: req.cookies.session ?? ""
        },
    });

    res.setHeader("Set-Cookie", `session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure`);
    res.status(200).json({ message: "Logged out" })
}