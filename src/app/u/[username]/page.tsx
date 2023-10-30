import {Metadata} from "next";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {users} from "@/db/schema";
import {notFound} from "next/navigation";
import {getProfile} from "@/auth/session";
import Button from "@/components/button";
import {PenIcon} from "lucide-react";
import Link from "next/link";

type PageProps = { params: { username: string } }

async function getUser(username: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.username, username)
    })
    if (!user) notFound()
    return user
}

export async function generateMetadata({params: {username}}: PageProps): Promise<Metadata> {
    const user = await getUser(username);
    return {
        title: `@${user.username}`,
        description: `View @${user.username}'s Profile on Cerulean.`
    }
}

export default async function Profile({params: {username}}: PageProps) {
    const user = await getUser(username);
    const currentUser = await getProfile();

    return (
        <figure className="flex gap-8 pt-8">
            <div className="w-48 aspect-square rounded-md bg-blue-600" />
            <figcaption className="flex flex-col gap-6">
                <div>
                    <h1 className="text-blue-950 font-bold text-2xl">@{user.username}</h1>
                    <p className="text-neutral-700">ID: {user.id}</p>
                </div>

                <div>
                    <p className="font-bold text-sm text-blue-950">Bio</p>
                    <p>Hello! This is an example biography.</p>
                </div>

                {currentUser && currentUser.username === username &&
                    <Link href="/settings/profile" className="contents">
                        <Button intent="primary"><PenIcon size={16} /> Edit profile</Button>
                    </Link>
                }
            </figcaption>
        </figure>
    )
}