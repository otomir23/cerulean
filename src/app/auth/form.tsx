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
        }} className="max-w-lg mx-auto flex flex-col gap-2 py-8 px-6 sm:px-8 border border-blue-50 rounded-lg">
            {children}
            {error && <p className="text-red-700">{error}</p>}
        </form>
    )
}