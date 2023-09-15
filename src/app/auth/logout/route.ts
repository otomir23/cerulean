import {endCurrentSession} from "@/auth/session";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
    await endCurrentSession()
    return NextResponse.redirect(new URL('/', req.url))
}