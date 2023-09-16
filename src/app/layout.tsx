import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {ReactNode} from "react";
import Header from "@/components/header";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: {
        default: 'Cerulean',
        template: '%s — Cerulean'
    },
    description: 'Work in progress.',
}

export default function RootLayout({children}: {
    children: ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
            <Header />
            <main className="px-12 sm:px-16">
                {children}
            </main>
        </body>
        </html>
    )
}
