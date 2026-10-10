"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Tabs as TabsPrimitive } from "radix-ui"

// Uniport tabs: a segmented control (surface-300 track, surface-400 active pill),
// or "bare" for tabs that sit inside a code block header.
function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("inline-flex", className)} {...props} />
}

const tabsListVariants = cva("inline-flex w-fit items-center gap-0.5", {
  variants: {
    variant: {
      segmented: "rounded-md border border-line-100 bg-surface-300 p-[3px]",
      bare: "p-0",
    },
  },
  defaultVariants: { variant: "segmented" },
})

function TabsList({
  className,
  variant = "segmented",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-sm px-3 font-sans text-[13px] font-medium whitespace-nowrap text-ink-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-text data-[state=active]:bg-surface-400 data-[state=active]:text-ink-100 data-[state=active]:shadow-[inset_0_1px_0_0_#ffffff0f]",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("outline-none", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
