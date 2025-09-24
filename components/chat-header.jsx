'use client'

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ChatHeader() {
    const router = useRouter();

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 justify-between">
            <div className="flex items-center gap-2" >
                <SidebarTrigger className="-ml-1" />
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                    {/* <Image src="/lentes.svg" alt="logo" width={30} height={30} /> */}
                    <h1 className="font-bold bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent italic">Nerd.lat</h1>
                </div>
            </div>
            <UserNav />
        </header>
    );
}
