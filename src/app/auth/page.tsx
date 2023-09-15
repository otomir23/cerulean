import {db} from "@/db";
import {users} from "@/db/schema";
import {eq} from "drizzle-orm";
import Link from "next/link";
import {getProfileRedirecting} from "@/auth/session";
import AuthForm from "@/app/auth/form";
import {login, nextStep, register} from "@/app/auth/actions";

export default async function Auth({searchParams}: { searchParams: Record<string, string> }) {
    const {as: email, redirect = "/"} = searchParams
    await getProfileRedirecting(redirect, true)

    if (email) {
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        if (user) return (
            <AuthForm action={login} redirect={redirect}>
                <input name="email" type="hidden" value={email} />
                {email}
                <Link href="/auth">change</Link>
                <input name="password" type="password" />
                <button type="submit">go</button>
            </AuthForm>
        )

        return (
            <AuthForm action={register} redirect={redirect}>
                <input name="email" type="hidden" value={email} />
                {email}
                <Link href="/auth">change</Link>
                <input name="username" />
                <input name="password" type="password" />
                <button type="submit">go</button>
            </AuthForm>
        )
    }

    return (
        <AuthForm action={nextStep}>
            <input name="email" type="email" />
            <button type="submit">go</button>
        </AuthForm>
    )
}