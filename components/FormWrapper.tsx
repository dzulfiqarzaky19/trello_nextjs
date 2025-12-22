"use client"

import { ReactNode } from "react"

type FormWrapperProps = {
    children: ReactNode
    action: (formData: FormData) => Promise<void>
    closeModal?: () => void
    className?: string
}

export const FormWrapper = ({ children, action, closeModal, className }: FormWrapperProps) => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        await action(formData)
        if (closeModal) closeModal()
    }

    return (
        <form onSubmit={handleSubmit} className={className}>
            {children}
        </form>
    )
}
