
import { Button } from "@/components/ui/button"
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const COLORS = [
    { id: "blue", value: "bg-blue-500", label: "Blue" },
    { id: "purple", value: "bg-purple-500", label: "Purple" },
    { id: "green", value: "bg-green-500", label: "Green" },
    { id: "orange", value: "bg-orange-500", label: "Orange" },
    { id: "red", value: "bg-red-500", label: "Red" },
    { id: "gray", value: "bg-gray-500", label: "Gray" },
]

export const ModalColumnForm = () => {
    return (
        <div className="space-y-6">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold">Create New Column</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="columnTitle" className="font-semibold">Column Name</Label>
                    <Input id="columnTitle" name="columnTitle" placeholder="e.g. QA Review, Backlog" required />
                </div>

                <div className="space-y-2">
                    <Label className="font-semibold">Header Color</Label>
                    <div className="flex gap-2">
                        {COLORS.map((color) => (
                            <div key={color.id} className="relative">
                                <input
                                    type="radio"
                                    name="headerColor"
                                    id={`color-${color.id}`}
                                    value={color.value}
                                    className="peer sr-only"
                                    defaultChecked={color.id === 'blue'}
                                />
                                <Label
                                    htmlFor={`color-${color.id}`}
                                    className={cn(
                                        "block size-8 rounded-full cursor-pointer transition-all hover:opacity-80 ring-offset-2 peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-black",
                                        color.value
                                    )}
                                >
                                    <span className="sr-only">{color.label}</span>
                                </Label>
                                <Check className="absolute inset-0 m-auto text-white size-5 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="description" className="font-semibold">Description</Label>
                        <span className="text-xs text-muted-foreground">Optional</span>
                    </div>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="What is this column for?"
                        className="min-h-[100px]"
                    />
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" type="button">Cancel</Button>
                <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">Create Column</Button>
            </DialogFooter>
        </div>
    )
}
