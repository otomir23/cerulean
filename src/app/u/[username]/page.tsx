import {Metadata} from "next";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {users} from "@/db/schema";
import {notFound} from "next/navigation";

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

    return (
        <figure className="flex gap-8 pt-8">
            <div className="w-48 aspect-square rounded-md bg-blue-600" />
            <figcaption>
                <h1 className="text-blue-950 font-bold text-2xl">@{user.username}</h1>
                <p className="text-neutral-700">ID: {user.id}</p>

                <p className="mt-4 font-bold text-sm text-blue-950">Bio</p>
                <p>Hello! This is an example biography.</p>
            </figcaption>
        </figure>
    )
}