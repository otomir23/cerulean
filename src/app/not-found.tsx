import Link from "next/link";

export default function NotFound() {
    return (
        <div className="mx-auto mt-24 w-fit text-center flex flex-col gap-2 max-w-xl">
            <h1 className="font-bold text-8xl text-blue-950">404</h1>
            <p className="text-xl">
                The page has not been found. One of the thing you may try to do is to{" "}
                <Link href="/" className="text-blue-950">go back home</Link>.
            </p>
        </div>
    )
}