import { Calendar, Folder, LayoutDashboard, LucideTrello, Settings, Users } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { SidebarLink } from "./SidebarLink"

const SIDEBAR_CONTENT = [
    {
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        href: '/'
    },
    {
        label: 'Projects',
        icon: 'Folder',
        href: '/projects'
    },
    {
        label: 'Team',
        icon: 'Users',
        href: '/team'
    },
    {
        label: 'Calendar',
        icon: 'Calendar',
        href: '/calendar'
    },
    {
        label: 'Settings',
        icon: 'Settings',
        href: '/settings'
    }
] as const

export const Sidebar = () => {

    return (
        <div className="grid grid-rows-[auto_1fr_auto] h-screen sticky top-0 z-10 shadow-xl">
            <header>
                <Button variant="ghost" className="w-full justify-baseline text-2xl">
                    <LucideTrello />
                    Trello clone
                </Button>
            </header>

            <aside className="flex flex-col gap-2 p-8 ">
                {SIDEBAR_CONTENT.map((item) => (
                    <SidebarLink key={item.label}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                    />
                ))}
            </aside>

            <footer>
                <Button variant="ghost" className="w-full justify-baseline">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    Trello clone
                </Button>
            </footer>
        </div>
    )
}