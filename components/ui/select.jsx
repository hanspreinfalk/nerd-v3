"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Select = React.forwardRef(({
    children,
    value,
    onValueChange,
    className,
    placeholder = "Select an option...",
    ...props
}, ref) => {
    const [open, setOpen] = React.useState(false)

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    ref={ref}
                    className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 dark:border-[#262626] bg-white dark:bg-[#0a0a0a] px-3 py-2 text-sm text-gray-900 dark:text-[#ededed] focus:outline-none focus:border-gray-400 dark:focus:border-[#404040] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    {...props}
                >
                    <span className={value ? "text-gray-900 dark:text-[#ededed]" : "text-gray-500 dark:text-[#888888]"}>
                        {value || placeholder}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[8rem] bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-[#262626]">
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    )
})
Select.displayName = "Select"

const SelectItem = React.forwardRef(({
    children,
    value,
    onSelect,
    className,
    ...props
}, ref) => {
    return (
        <DropdownMenuItem
            ref={ref}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 dark:hover:bg-[#262626] focus:bg-gray-100 dark:focus:bg-[#262626] text-gray-900 dark:text-[#ededed]",
                className
            )}
            onSelect={() => onSelect?.(value)}
            {...props}
        >
            {children}
        </DropdownMenuItem>
    )
})
SelectItem.displayName = "SelectItem"

const SelectValue = React.forwardRef(({ placeholder, ...props }, ref) => {
    return <span ref={ref} {...props}>{placeholder}</span>
})
SelectValue.displayName = "SelectValue"

export { Select, SelectItem, SelectValue }
