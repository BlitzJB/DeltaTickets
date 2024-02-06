import { useState, useEffect } from "react"
import crypto from "crypto"
import { PrismaClient } from "@prisma/client"

interface PublicUser {
    id: string
    name: string
    email: string
}

export const useCurrentUser = () => {
    const [user, setUser] = useState<PublicUser | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
        fetch("/api/me")
        .then((res) => res.json())
        .then((data) => {
            if (data.user) {
                setUser(data.user)
            }
            setLoading(false)
        })
        .catch(() => {
            setLoading(false)
            setError("An error occurred while fetching the user")
        })
    }, [])
    
    return { user, loading, error }
}

export const getUser = async (id: string) => {
    const client = new PrismaClient()
    const user = await client.user.findUnique({
        where: {
            id
        }
    })
    client.$disconnect()
    return user
}

export const hashPassword = (password: string) => {
    const salt = crypto.randomBytes(8).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return [salt, hash].join("$");
}

export const verifyPassword = (password: string, original: string) => {
    const originalHash = original.split("$")[1];
    const salt = original.split("$")[0];
    const hash = crypto.pbkdf2Sync(password, salt!, 100000, 64, "sha512").toString("hex");
    return hash === originalHash;
}

export const sanitizeUser = (user: any) => {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
}