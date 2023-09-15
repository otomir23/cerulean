import {getProfile} from "@/auth/session";
import Link from "next/link";
import {LogInIcon} from "lucide-react";

export default async function HeaderProfile() {
    const profile = await getProfile()
    if (!profile) return <Link href="/auth">Login</Link>
    return (
        <div className="flex gap-1 items-center">
            <Link href={`/u/${profile.username}`}>@{profile.username}</Link>
            <Link href="/auth/logout"><LogInIcon size={16} /></Link>
        </div>
    )
}