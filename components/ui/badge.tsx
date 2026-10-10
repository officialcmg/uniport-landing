import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "inline-flex h-[22px] w-fit shrink-0 items-center gap-1.5 rounded-full border px-2 text-xs leading-4 font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "border-line-100 bg-surface-300 text-ink-200",
        accent: "border-transparent bg-brand-soft text-brand-text",
        success: "border-transparent bg-success-soft text-success",
        warning: "border-transparent bg-warning-soft text-warning",
      },
      dot: {
        true: "before:size-1.5 before:rounded-full before:bg-current before:content-['']",
      },
      square: { true: "rounded-sm font-mono" },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

function Badge({
  className,
  variant = "neutral",
  dot,
  square,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, dot, square }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
