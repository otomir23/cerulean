"use server"

import {db} from "@/db";
import {eq} from "drizzle-orm";
import {users} from "@/db/schema";
import {generateSalt, hashPassword} from "@/auth/secrets";
import {startSession} from "@/auth/session";
import {AuthErrorKey, authErrors, MIN_PASSWORD_LENGTH} from "@/app/auth/errors";

export type ServerActionResponse = {
    success: boolean,
    error?: string,
    redirect?: Record<string, string>
} & ({
    success: true,
} | {
    success: false,
    error: AuthErrorKey,
})

const emailRegex = /^\S+@\S+\.\S+$/
const usernameRegex = /^[A-Za-z1-9_]{3,16}$/

function error(key: AuthErrorKey): never {
    throw new Error(key)
}

function require<const T extends string,>(keys: T[], data: FormData): {[key in T]: string} {
    const entries = keys.map(key => {
        const value = data.get(key)
        if (typeof value !== 'string') return error("missing");
        return [key, value]
    }) satisfies [T, string][]
    return Object.fromEntries(entries) as {[key in T]: string} // I fucking hate Object methods, make them fucking generic please I beg you
}

function createAction<const T extends string,>(
    keys: T[], callback: (data: {[key in T]: string}) => Promise<ServerActionResponse>
): (formData: FormData) => Promise<ServerActionResponse> {
    return async (formData: FormData) => {
        try {
            return await callback(require(keys, formData))
        } catch (e) {
            const errorKey = e instanceof Error ? e.message : String(e)
            const error = (authErrors.has(errorKey as AuthErrorKey) ? errorKey : "unknown") as AuthErrorKey
            return { success: false, error }
        }
    }
}

export const nextStep = createAction(["email"], async ({email}) => {
    // Validating input
    if (!emailRegex.test(email)) error("invalid_email")

    return {
        success: true,
        redirect: {
            as: email
        }
    }
})

export const login = createAction(["email", "password"], async ({email, password}) => {
    // Validating user existence
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    })
    if (!user) error("unknown")

    // Validating password match
    if (hashPassword(password, user.passwordSalt) !== user.passwordHash) error("credentials")

    return { success: true }
})

export const register = createAction(["email", "password", "username"], async (
    {email, password, username}
) => {
    // Validating input
    if (password.length < MIN_PASSWORD_LENGTH) error("password_too_short")
    if (!emailRegex.test(email)) error("invalid_email")
    if (!usernameRegex.test(username)) error("invalid_username")

    // Validating email & username uniqueness
    if ((await db.select({}).from(users).where(eq(users.email, email))).length)
        error("unknown")
    if ((await db.select({}).from(users).where(eq(users.username, username))).length)
        error("username_taken")

    // Creating password hash with generated salt
    const salt = generateSalt()
    const hash = hashPassword(password, salt)

    // Adding user to the database
    const insertResult = await db.insert(users).values({
        email,
        username,
        passwordHash: hash,
        passwordSalt: salt
    }).returning({insertedId: users.id})

    // Retrieving insert result
    const user = insertResult[0]
    if (!user) {
        console.error("User was not returned. " + email)
        error("unknown")
    }

    // Creating session and saving its JWT to cookies
    await startSession({
        id: user.insertedId,
        email,
        username,
        avatar: null
    })

    return { success: true }
})