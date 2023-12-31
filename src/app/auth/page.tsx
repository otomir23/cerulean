import {db} from "@/db";
import {users} from "@/db/schema";
import {eq} from "drizzle-orm";
import Link from "next/link";
import {getProfileRedirecting} from "@/auth/session";
import AuthForm from "@/app/auth/form";
import {login, nextStep, register} from "@/app/auth/actions";
import Button from "@/components/button";
import Input from "@/components/input";
import {PencilLineIcon} from "lucide-react";

export default async function Auth({searchParams}: { searchParams: Record<string, string> }) {
    const {as: email, redirect = "/"} = searchParams
    await getProfileRedirecting(redirect, true)

    if (email) {
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        return (
            <AuthForm action={user ? login : register} redirect={redirect}>
                <Input name="email" type="email" className="hidden" value={email} />
                <h1 className="text-xl font-bold">{user ? "Welcome back!" : "Nice to meet you!"}</h1>
                <div className="flex justify-between items-center mb-4 text-sm">
                    <p>
                        <span className="text-neutral-700">{user ? "Logging in" : "Registering"} as:</span>{' '}
                        <span className="font-semibold">{email}</span>
                    </p>
                    <Link href="/auth" className="text-blue-700 min-w-fit">
                        Change <PencilLineIcon size={12} className="inline" />
                    </Link>
                </div>
                {!user && <Input name="username" label="Username" placeholder="user1337"/>}
                <Input name="password" type="password" label="Password" placeholder="8 characters minimum" />
                <Button type="submit" intent="primary">Done</Button>
            </AuthForm>
        )
    }

    return (
        <AuthForm action={nextStep}>
            <Input name="email" type="email" label="Email" placeholder="damir@otomir23.me"  />
            <Button type="submit" intent="primary">Next</Button>
        </AuthForm>
    )
}