"use client"

import {ReactNode, useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import type {ServerActionResponse} from "@/app/auth/actions";
import {authErrors} from "@/app/auth/errors";

export default function AuthForm({ redirect, action, children }: {
    redirect?: string,
    action: (formData: FormData) => Promise<ServerActionResponse>,
    children: ReactNode
}) {
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const path = usePathname()
    const params = useSearchParams()

    useEffect(() => setError(null), [path, params])

    return (
        <form action={async data => {
            setError(null)
            const res = await action(data)
            if (res.redirect) {
                router.push(path + '?' + new URLSearchParams([
                    ...Object.entries(res.redirect),
                    ...params.entries()
                ]))
            }
            if (res.success) {
                return redirect && router.push(redirect)
            }
            setError(authErrors.get(res.error) || "Fallback error")
        }}>
            {children}
            {error}
        </form>
    )
}