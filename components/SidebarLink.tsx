"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { LayoutDashboard, Folder, Users, Calendar, Settings } from "lucide-react"

const ICONS = { LayoutDashboard, Folder, Users, Calendar, Settings }

export const SidebarLink = ({ href, label, icon }: { href: string; label: string; icon: keyof typeof ICONS }) => {
    const pathname = usePathname()

    const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href)

    const Icon = ICONS[icon]

    return (
        <Link href={href} className="w-full" aria-current={isActive ? "page" : undefined}>
            <Button
                variant="ghost"
                className="cursor-pointer justify-baseline w-full text-xl"
                style={{
                    backgroundColor: isActive ? "rgba(255, 165, 0, 0.1)" : "transparent",
                    color: isActive ? "#FFA500" : "#000",
                }}
            >
                <Icon fill={isActive ? "#FFA500" : "#000"} stroke={isActive ? "#FFA500" : "#000"} />
                {label}
            </Button>
        </Link>
    )
}