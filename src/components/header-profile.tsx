import {getProfile} from "@/auth/session";
import Link from "next/link";
import {LogInIcon, LogOutIcon} from "lucide-react";

export default async function HeaderProfile() {
    const profile = await getProfile()
    if (!profile) return (
        <Link href="/auth" className="flex gap-2 items-center">
            <LogInIcon size={16} /> Login
        </Link>
    )
    return (
        <div className="flex gap-2 items-center">
            <Link href={`/u/${profile.username}`}>@{profile.username}</Link>
            <Link href="/auth/logout"><LogOutIcon size={16} /></Link>
        </div>
    )
}