"use client"

import { CardAvatar } from "@/components/CardAvatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
    AlignLeft,
    Archive,
    CheckSquare,
    Clock,
    Copy,
    CreditCard,
    Eye,
    FileText,
    Laptop,
    Link as LinkIcon,
    Move,
    Paperclip,
    Tag,
    Trash2,
    User
} from "lucide-react"

import { ProjectCard } from "@/app/projects/page"

interface ModalFormProps {
    card?: ProjectCard
}

export const ModalForm = ({
    card
}: ModalFormProps) => {
    return (
        <div className="grid grid-cols-[1fr_auto] gap-6 h-full min-h-0">
            {/* Main Content */}
            <div className="space-y-6 overflow-y-auto pr-2 -mr-2 scroll-m-0">
                {/* Header */}
                <div className="sticky top-0 bg-background z-10 pb-4">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                            <Laptop className="size-5" />
                            <Input
                                name="title"
                                defaultValue={card?.title}
                                placeholder="Task Title"
                                className="font-semibold text-xl border-none shadow-none focus-visible:ring-0 px-0 h-auto p-0"
                            />
                        </DialogTitle>
                        {card?.id && <input type="hidden" name="id" value={card.id} />}
                    </DialogHeader>

                    <div className="text-sm text-muted-foreground mt-1">
                        in list <span className="underline cursor-pointer">Design Backlog</span>
                    </div>
                </div>

                {/* Members, Labels, Due Date Row */}
                <div className="flex items-start gap-6">
                    {/* Members */}
                    <div className="shrink-0">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                            Members
                        </div>
                        <CardAvatar
                            assignees={[
                                { id: "user-1", name: "Alice", image: "https://randomuser.me/api/portraits/women/1.jpg" },
                                { id: "user-2", name: "Bob", image: "https://randomuser.me/api/portraits/men/2.jpg" },
                            ]}
                            isEditable
                        />
                    </div>

                    {/* Labels */}
                    <div className="shrink-0">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                            Labels
                        </div>
                        <div className="flex flex-wrap gap-1">
                            <Badge className="bg-red-500 text-white hover:bg-red-600 cursor-pointer">
                                High Priority
                            </Badge>
                            <Badge className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
                                Design
                            </Badge>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="shrink-0">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                            Due Date
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="due-complete" />
                            <Label htmlFor="due-complete" className="flex items-center gap-2 cursor-pointer">
                                <span>Oct 24 at 5:00 PM</span>
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                                    SOON
                                </Badge>
                            </Label>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlignLeft className="size-5" />
                            <h3 className="font-semibold">Description</h3>
                        </div>
                        <Button variant="ghost" size="sm" className="text-sm">
                            Edit
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground pl-7">
                        <Textarea
                            name="description"
                            defaultValue={card?.description}
                            placeholder="Add a more detailed description..."
                            className="min-h-[100px] bg-transparent"
                        />
                    </div>
                </div>

                {/* Attachments */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Paperclip className="size-5" />
                        <h3 className="font-semibold">Attachments</h3>
                    </div>
                    <div className="pl-7 space-y-2">
                        <div className="flex items-center gap-3 p-2 border rounded-lg hover:bg-accent cursor-pointer">
                            <div className="bg-gray-100 rounded p-2 shrink-0">
                                <FileText className="size-6 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">Hero_Section_V2.png</div>
                                <div className="text-xs text-muted-foreground">
                                    Added just now • <span className="underline cursor-pointer">Comment</span> • <span className="underline cursor-pointer">Delete</span>
                                </div>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">FIG</Badge>
                                <Badge variant="outline" className="text-xs">COVER</Badge>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-2 border rounded-lg hover:bg-accent cursor-pointer">
                            <div className="bg-gray-100 rounded p-2 shrink-0">
                                <FileText className="size-6 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">Q3_Campaign_Assets.fig</div>
                                <div className="text-xs text-muted-foreground">
                                    Added Oct 20 • <span className="underline cursor-pointer">Comment</span> • <span className="underline cursor-pointer">Delete</span>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <Badge variant="outline" className="text-xs">FIG</Badge>
                            </div>
                        </div>

                        <Button variant="ghost" size="sm" className="text-sm">
                            Add
                        </Button>
                    </div>
                </div>

                {/* Implementation Steps (Checklist) */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="size-5" />
                            <h3 className="font-semibold">Implementation Steps</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">66%</span>
                            <Button variant="ghost" size="sm" className="text-xs">
                                Hide checked items
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs">
                                Delete
                            </Button>
                        </div>
                    </div>
                    <div className="pl-7 space-y-3">
                        <Progress value={66} className="h-2" />

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Checkbox id="step-1" defaultChecked />
                                <Label htmlFor="step-1" className="cursor-pointer">
                                    Review brand guidelines
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox id="step-2" defaultChecked />
                                <Label htmlFor="step-2" className="cursor-pointer">
                                    Export assets from Figma
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox id="step-3" />
                                <Label htmlFor="step-3" className="cursor-pointer">
                                    Implement new hero HTML structure
                                </Label>
                            </div>
                        </div>

                        <Button variant="ghost" size="sm" className="text-sm">
                            Add an item
                        </Button>
                    </div>
                </div>

                {/* Activity */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="size-5" />
                            <h3 className="font-semibold">Activity</h3>
                        </div>
                        <Button variant="ghost" size="sm" className="text-sm">
                            Show details
                        </Button>
                    </div>

                    <div className="pl-7 space-y-4">
                        {/* Comment Input */}
                        <div className="flex items-start gap-2">
                            <CardAvatar
                                assignees={[
                                    { id: "user-current", name: "You", image: "https://randomuser.me/api/portraits/women/5.jpg" },
                                ]}
                            />
                            <div className="flex-1">
                                <Textarea placeholder="Write a comment..." className="min-h-[80px]" />
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <Paperclip className="size-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <User className="size-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <FileText className="size-4" />
                                        </Button>
                                    </div>
                                    <Button size="sm">Save</Button>
                                </div>
                            </div>
                        </div>

                        {/* Activity Item */}
                        <div className="flex items-start gap-2">
                            <CardAvatar
                                assignees={[
                                    { id: "user-1", name: "John Doe", image: "https://randomuser.me/api/portraits/men/1.jpg" },
                                ]}
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm">John Doe</span>
                                    <span className="text-xs text-muted-foreground">Yesterday at 2:30 PM</span>
                                </div>
                                <div className="bg-accent rounded-lg p-3 text-sm">
                                    Here are the initial sketches for the new layout. I think option B works best for the
                                    responsive view.
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                                        Reply
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar - Add to Card Actions */}
            <div className="w-[180px] space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                    Add to card
                </div>

                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                    <User className="size-4" />
                    Members
                </Button>

                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                    <Tag className="size-4" />
                    Labels
                </Button>

                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                    <CheckSquare className="size-4" />
                    Checklist
                </Button>

                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                    <Clock className="size-4" />
                    Dates
                </Button>

                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                    <Paperclip className="size-4" />
                    Attachment
                </Button>

                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                    <CreditCard className="size-4" />
                    Cover
                </Button>

                <div className="text-xs font-semibold text-muted-foreground uppercase mt-6 mb-3">
                    Actions
                </div>

                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                    <Move className="size-4" />
                    Move
                </Button>

                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                    <Copy className="size-4" />
                    Copy
                </Button>

                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                    <FileText className="size-4" />
                    Make template
                </Button>

                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                    <Eye className="size-4" />
                    Watch
                </Button>

                <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                    <Archive className="size-4" />
                    Archive
                </Button>

                <Button variant="secondary" size="sm" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="size-4" />
                    Delete
                </Button>
            </div>
        </div>
    )
}