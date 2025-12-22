import { addTask } from "@/app/actions"
import { IProjectsPageContentDummy } from "@/app/projects/page"
import { CardDemo } from "@/components/Card"
import { FormWrapper } from "@/components/FormWrapper"
import { Modal } from "@/components/Modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Ellipsis, Plus } from "lucide-react"
import { ModalForm } from "./components/ModalForm"

export const Main = ({
    cardContent
}: {
    cardContent: IProjectsPageContentDummy
}) => {
    return (
        <main className="flex justify-between">
            {cardContent.map((list) => (
                <Card key={list.id} className="border-none shadow-none rounded-none bg-transparent">
                    <CardHeader className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={cn("size-2 rounded-full", list.color)} />
                            <CardTitle>{list.title}</CardTitle>
                            <div className="size-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">{list.cards.length}</div>
                        </div>

                        <Button variant="ghost">
                            <Ellipsis />
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {list.cards.map((card) => (
                            <Modal key={card.id} trigger={<CardDemo {...card} />}>
                                <div className="space-y-4" aria-describedby="details">
                                    <p id="details">{card.description}</p>
                                </div>
                            </Modal>
                        ))}
                    </CardContent>

                    <CardFooter>
                        <Modal trigger={<Button variant="ghost" className="w-full cursor-pointer">
                            <Plus />
                            Add Task
                        </Button>}>
                            <FormWrapper action={addTask}>
                                <ModalForm />
                            </FormWrapper>
                        </Modal>
                    </CardFooter>
                </Card>
            ))}
        </main>
    )
}