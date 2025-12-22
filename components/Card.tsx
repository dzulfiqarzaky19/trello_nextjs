import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress";
import { CheckCircle2Icon, } from "lucide-react";
import { CardAvatar } from "./CardAvatar";
import { CardFooterRight } from "./CardFooterRight";
import { Button } from "./ui/button";


interface ICardProps {
    title: string;
    labels: { id: string; name: string; color: string }[];
    progress?: { completed: number; total: number; percent: number };
    dueDate: string;
    assignees: { id: string; name: string; image: string }[];
    comments: number;
    attachments: number;
    status: string;
    description?: string;
}

export const CardDemo = ({
    title,
    labels,
    progress,
    dueDate,
    assignees,
    comments,
    attachments,
    description,
    status,
}: ICardProps) => {

    const isOverdue = dueDate ? new Date(dueDate) < new Date() : false

    return (


        <Card className="border-none cursor-pointer hover:shadow-lg" >

            <CardHeader>
                <div className="flex items-center gap-0.5 flex-wrap">
                    {labels.map((label) => (
                        <Badge
                            key={label.id}
                            style={{ backgroundColor: label.color }}
                            className="text-white"
                        >
                            {label.name}
                        </Badge>
                    ))}
                </div>

                <CardTitle className="flex items-center gap-2">{title}
                    {status === 'done' && (
                        <CheckCircle2Icon fill="#10B981" color="white" />
                    )}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}

                {progress && (progress.percent !== 100 && progress.percent !== 0) && (
                    <Progress value={progress.percent} progressClassName={cn(isOverdue && "bg-destructive")} />
                )}
            </CardContent>

            <CardFooter className="flex items-center justify-between">
                <CardAvatar assignees={assignees} />

                <CardFooterRight comments={comments} attachments={attachments} progress={progress} dueDate={dueDate} status={status} />

            </CardFooter>
        </Card>
    )
}