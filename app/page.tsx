import { CardDemo } from "@/components/Card";
import DropdownMenuDemo from "@/components/DropdownMenuMemo";
import { ProgressDemo } from "@/components/ProgressDemo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-zinc-100 dark:bg-primary">
      <div>
        test all ui components

        <div>
          All badges :
          <Badge>Default</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="secondary">Secondary</Badge>
        </div>

        <div className="flex items-center gap-2">
          All Avatars :
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div>
          All buttons :
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="secondary">Secondary</Button>
        </div>

        <div>
          All cards :
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription>Card Description</CardDescription>
            </CardContent>

            <CardFooter>

              <CardAction>
                <Button>Button</Button>
              </CardAction>
            </CardFooter>
          </Card>
        </div>

        <div>
          All Dialogs :

          {/* use all dialog components below */}
          <Dialog>
            {/*  what about dialogPortal ? */}

            <DialogPortal>
              <DialogOverlay />
            </DialogPortal>

            <DialogTrigger>Open</DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>Dialog Description</DialogDescription>
              </DialogHeader>



              <DialogFooter>
                <DialogClose>Close</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div>
          All Dropdowns :

          <DropdownMenuDemo />
        </div>

        <div>
          All Input :
          <Input />
        </div>

        <div>
          All Labels :
          <Label>Label</Label>
        </div>

        <ProgressDemo />



      </div>
    </div>
  );
}
