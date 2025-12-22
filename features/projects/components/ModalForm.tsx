
"use client"

import { CardAvatar } from "@/components/CardAvatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Laptop } from "lucide-react"

export const ModalForm = () => {
    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                    <Laptop />
                    Redesign Landing Page for Q3 Campaign</DialogTitle>


            </DialogHeader>

            <div className="text-muted-foreground text-sm mt-2">
                in List Design Backlog
            </div>

            <div className="flex items-center gap-2 mt-2">
                <div className="relative" onClick={() => console.log('click member')}>
                    Member
                    <CardAvatar assignees={[
                        { id: "user-1", name: "Alice", image: "https://randomuser.me/api/portraits/women/1.jpg" },
                        { id: "user-2", name: "Bob", image: "https://randomuser.me/api/portraits/men/2.jpg" },
                        { id: "user-3", name: "Bobby", image: "https://randomuser.me/api/portraits/men/2.jpg" },
                    ]}
                        isEditable
                    />
                </div>

                <div>
                    Labels
                    <div className="flex items-center gap-2">
                        <Badge className="text-white">High Priority</Badge>
                        <Badge className="text-white">Design</Badge>
                    </div>
                </div>

                <div>
                    Due Date
                    <div className="flex items-center gap-2">
                        <Badge className="text-white rounded-sm">2025-12-22</Badge>
                        <Badge variant="secondary">SOON</Badge>
                    </div>
                </div>
            </div>

            <div className="space-y-4 mt-2">
                Description
                <Textarea />
            </div>

            <div className="mt-2">
                Attachments
                <Input type="file" />
            </div>

            <div className="space-y-2 mt-2">
                Implementation Steps

                <Progress value={50} />

                <div className="flex items-center gap-2">
                    <Checkbox id="step-1" />
                    <Label htmlFor="step-1">Review Brand Guidelines</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox id="step-2" />
                    <Label htmlFor="step-2">Import Assets from figma</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox id="step-3" />
                    <Label htmlFor="step-3">Implement new Hero Layout</Label>
                </div>

                <Button size="sm" variant="outline">Add More</Button>
            </div>

            <div className="mt-4 space-y-4">
                Activity

                <div className="flex items-center gap-2 mt-4">
                    <CardAvatar assignees={[
                        { id: "user-1", name: "Alice", image: "https://randomuser.me/api/portraits/women/1.jpg" },
                    ]}
                    />

                    <div className="w-full flex flex-col gap-2">

                        <Textarea />

                        <Button size="sm" variant="outline">Save</Button>
                    </div>

                </div>


                <div className="flex items-start gap-2">
                    <CardAvatar assignees={[
                        { id: "user-1", name: "Alice", image: "https://randomuser.me/api/portraits/women/1.jpg" },
                    ]}
                    />

                    <div>
                        <div className="flex gap-2">
                            John Wick

                            <div>22 dec 2025</div>
                        </div>

                        <div className="shadow-sm p-2 rounded-md">

                            Here are the initial sketches for the new layout. I think the option 8 would be the best for the responsive layout
                        </div>
                    </div>
                </div>

            </div>

            <DialogFooter className="flex mt-2">

                <Button type="submit">Add Task</Button>
            </DialogFooter>

        </>
    )
}