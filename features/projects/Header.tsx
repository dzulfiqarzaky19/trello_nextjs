import { addColumn } from "@/app/actions"
import { FormWrapper } from "@/components/FormWrapper"
import { Modal } from "@/components/Modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bell, Filter, List, PlusIcon, Search, SquareKanban, User } from "lucide-react"

interface IHeaderProps {
    label: string,
    description: string
}

export const Header = ({
    label,
    description
}: IHeaderProps) => {
    return (
        <header>
            <div className="flex items-center justify-between p-8">
                <div className="flex flex-col">
                    <div className="text-2xl font-bold">{label}</div>
                    <div>{description}</div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Label htmlFor="search" className="sr-only">Search</Label>
                        <Input id="search"
                            placeholder="Search the docs..."
                            className="pl-8" />
                        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 select-none" />
                    </div>
                    <Button variant="default"><Bell /></Button>
                </div>
            </div>

            <div className="flex items-center justify-between p-8">
                <div className="flex">
                    <Button variant="ghost" className="cursor-pointer"><SquareKanban /> Board</Button >
                    <Button variant="ghost" className="cursor-pointer"><List /> List</Button >
                    <Button variant="ghost" className="cursor-pointer"><User /> My Task</Button >
                    <Button variant="ghost" className="cursor-pointer"><Filter /> Filters</Button >
                </div>

                <div className="flex items-center gap-2">
                    <Modal trigger={
                        <Button variant="default" className="cursor-pointer">
                            <PlusIcon /> New Column
                        </Button>
                    }>
                        <FormWrapper action={addColumn}>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="columnTitle">Column Title</Label>
                                    <Input id="columnTitle" name="columnTitle" required />
                                </div>
                                <Button type="submit" className="cursor-pointer">Add Column</Button>
                            </div>
                        </FormWrapper>
                    </Modal>
                </div>
            </div>

        </header>
    )
}