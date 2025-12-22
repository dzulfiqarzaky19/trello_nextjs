"use client"

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function DropdownMenuDemo() {
    const [showCompleted, setShowCompleted] = useState(true)
    const [priority, setPriority] = useState("medium")

    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent sideOffset={8} className="bg-red-500">
                {/* Label */}
                <DropdownMenuLabel>Board Actions</DropdownMenuLabel>

                {/* Group of items */}
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        New Card
                        <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive">
                        Delete Board
                        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Checkbox item */}
                <DropdownMenuCheckboxItem
                    checked={showCompleted}
                    onCheckedChange={setShowCompleted}
                >
                    Show Completed Tasks
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator />

                {/* Radio group */}
                <DropdownMenuLabel inset>Priority</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                    value={priority}
                    onValueChange={setPriority}
                >
                    <DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                {/* Submenu */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem>Export Board</DropdownMenuItem>
                        <DropdownMenuItem>Import Data</DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}