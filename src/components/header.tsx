import {Suspense} from "react";
import HeaderProfile from "@/components/header-profile";
import Link from "next/link";

export default function Header() {

    return (
        <header className="sticky top-0 inset-x-0 bg-blue-50 py-6 text-blue-950 flex justify-between mb-4 px-12 sm:px-16">
            <Link href="/" className="font-bold text-lg">Cerulean</Link>
            <Suspense fallback={<div className="h-4 w-24 bg-blue-300 animate-pulse" />}>
                <HeaderProfile />
            </Suspense>
        </header>
    )
}