"use server"

import { CardDemo } from "@/components/Card";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Bell, Ellipsis, Filter, List, Plus, PlusIcon, Search, SquareKanban, User } from "lucide-react";

const PROJECTS_PAGE_HEADER =
{
    label: 'Website Redesign Project',
    description: 'Manage tasks, track progress, and collaborate with your team'
}

const PROJECTS_PAGE_CONTENT_DUMMY = [
    {
        id: "todo",
        title: "TO DO",
        color: "bg-gray-500",
        cards: [
            {
                id: "card-1",
                title: "Draft Wireframes",
                labels: [
                    { id: "label-design", name: "DESIGN", color: "#3B82F6" },
                    { id: "label-high", name: "HIGH", color: "#EF4444" },
                ],
                description: "Create initial wireframes for the homepage and product listing pages...",
                assignees: [
                    { id: "user-1", name: "Alice", image: "https://randomuser.me/api/portraits/women/1.jpg" },
                    { id: "user-2", name: "Bob", image: "https://randomuser.me/api/portraits/men/2.jpg" },
                ],
                comments: 2,
                attachments: 4,
                status: "todo",
                progress: { completed: 0, total: 3, percent: 0 }, // not yet touched
                dueDate: "2025-12-18",
                createdAt: "2025-12-01",
                updatedAt: "2025-12-10",
            },
            {
                id: "card-2",
                title: "Competitor Analysis",
                labels: [{ id: "label-research", name: "RESEARCH", color: "#10B981" }],
                assignees: [
                    { id: "user-3", name: "Charlie", image: "https://randomuser.me/api/portraits/men/3.jpg" },
                ],
                comments: 1,
                attachments: 0,
                status: "todo",
                progress: { completed: 0, total: 8, percent: 0 }, // not yet touched
                dueDate: "2025-12-20",
                createdAt: "2025-12-05",
                updatedAt: "2025-12-12",
            },
            {
                id: "card-3",
                title: "Client Meeting Prep",
                labels: [{ id: "label-client", name: "CLIENT", color: "#F59E0B" }],
                description: "Prepare slide deck for the weekly sync with the client.",
                assignees: [
                    { id: "user-4", name: "Diana", image: "https://randomuser.me/api/portraits/women/4.jpg" },
                ],
                comments: 0,
                attachments: 1,
                status: "todo",
                progress: { completed: 1, total: 8, percent: 12 }, // finished
                dueDate: "2025-12-15",
                createdAt: "2025-12-07",
                updatedAt: "2025-12-14",
            },
        ],
    },
    {
        id: "in-progress",
        title: "IN PROGRESS",
        color: "bg-blue-500",
        cards: [
            {
                id: "card-4",
                title: "Homepage Hero Section",
                labels: [
                    { id: "label-urgent", name: "URGENT", color: "#DC2626" },
                    { id: "label-dev", name: "DEV", color: "#6366F1" },
                ],
                description: "Implement the responsive hero section with video background component.",
                assignees: [
                    { id: "user-5", name: "Eve", image: "https://randomuser.me/api/portraits/women/5.jpg" },
                    { id: "user-6", name: "Frank", image: "https://randomuser.me/api/portraits/men/6.jpg" },
                    { id: "user-7", name: "Grace", image: "https://randomuser.me/api/portraits/women/7.jpg" },
                ],
                comments: 3,
                attachments: 2,
                status: "in-progress",
                progress: { completed: 3, total: 5, percent: 60 }, // in progress
                dueDate: "2025-12-19",
                createdAt: "2025-12-02",
                updatedAt: "2025-12-13",
            },
            {
                id: "card-5",
                title: "Dark Mode Implementation",
                labels: [{ id: "label-dev", name: "DEV", color: "#6366F1" }],
                assignees: [
                    { id: "user-8", name: "Henry", image: "https://randomuser.me/api/portraits/men/8.jpg" },
                ],
                comments: 0,
                attachments: 0,
                status: "in-progress",
                progress: { completed: 0, total: 10, percent: 60 }, // in progress
                dueDate: "2025-12-24",
                createdAt: "2025-12-04",
                updatedAt: "2025-12-14",
            },
        ],
    },
    {
        id: "done",
        title: "DONE",
        color: "bg-green-500",
        cards: [
            {
                id: "card-6",
                title: "Project Kickoff",
                labels: [{ id: "label-admin", name: "ADMIN", color: "#6B7280" }],
                description: "Initial meeting with stakeholders to define scope and requirements.",
                assignees: [
                    { id: "user-9", name: "Max", image: "https://github.com/maxleiter.png" },
                    { id: "user-10", name: "Shadcn", image: "https://github.com/shadcn.png" },
                ],
                comments: 0,
                attachments: 0,
                progress: { completed: 1, total: 1, percent: 100 }, // finished
                dueDate: "2025-11-20",
                status: "done",
                createdAt: "2025-11-20",
                updatedAt: "2025-11-21",
            },
            {
                id: "card-7",
                title: "Brand Assets Collection",
                labels: [{ id: "label-design", name: "DESIGN", color: "#3B82F6" }],
                assignees: [
                    { id: "user-11", name: "Shadcn", image: "https://github.com/shadcn.png" },
                ],
                comments: 12,
                attachments: 3,
                progress: { completed: 4, total: 4, percent: 100 }, // finished
                dueDate: "2025-11-25",
                status: "done",
                createdAt: "2025-11-22",
                updatedAt: "2025-11-25",
            },
        ],
    },
]

export default async function ProjectsPage() {



    return (
        <div className="min-h-screen font-sans bg-zinc-100 dark:bg-primary grid grid-rows-[auto_1fr]">
            <header>
                <div className="flex items-center justify-between p-8">
                    <div className="flex flex-col">
                        <div className="text-2xl font-bold">{PROJECTS_PAGE_HEADER.label}</div>
                        <div>{PROJECTS_PAGE_HEADER.description}</div>
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
                        } title="Add New Column">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="columnTitle">Column Title</Label>
                                    <Input id="columnTitle" name="columnTitle" required />
                                </div>

                                <Button type="submit" className="cursor-pointer">Add Column</Button>
                            </div>
                        </Modal>
                    </div>
                </div>

            </header>

            <main className="flex justify-between">
                {PROJECTS_PAGE_CONTENT_DUMMY.map((list) => (
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
                                <Modal key={card.id} trigger={<CardDemo {...card} />} title="Edit Task">
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
                            </Button>} title="Add New Task">
                                <form action={async (formData: FormData) => {
                                    console.log("Adding new task", formData)
                                }}>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="title">Task Title</Label>
                                            <Input id="title" name="title" required />
                                        </div>
                                        <div>
                                            <Label htmlFor="description">Description</Label>
                                            <Input id="description" name="description" />
                                        </div>
                                        <Button type="submit">Add Task</Button>
                                    </div>
                                </form>
                            </Modal>
                        </CardFooter>
                    </Card>
                ))}
            </main>
        </div>
    )
}