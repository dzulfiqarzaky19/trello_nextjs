"use client"

import { useState, cloneElement, isValidElement } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"


export const Modal = ({ children, trigger }: { children: React.ReactNode, trigger: React.ReactNode }) => {
    const [open, setOpen] = useState(false)

    const childrenWithProps = isValidElement(children)
        ? cloneElement(children as React.ReactElement<any>, { closeModal: () => setOpen(false) })
        : children

    return (
        <Dialog open={open} onOpenChange={setOpen} modal>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                {childrenWithProps}
            </DialogContent>
        </Dialog>
    )
}           