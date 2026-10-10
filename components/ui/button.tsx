import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// Uniport button: primary (ink fill), secondary, ghost, and accent (Flare —
// reserved for the moment money moves). Sizes sm 28 / md 36 / lg 44.
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-transparent font-sans font-medium whitespace-nowrap transition-[background-color,border-color,box-shadow,color] duration-150 ease-[cubic-bezier(0.2,0,0,1)] outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-text active:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-ink-100 text-on-ink shadow-button hover:bg-ink-200",
        secondary:
          "border-line-200 bg-surface-300 text-ink-100 hover:bg-surface-400",
        ghost:
          "bg-transparent text-ink-200 hover:bg-surface-300 hover:text-ink-100",
        accent:
          "bg-brand font-semibold text-on-brand shadow-button hover:shadow-[var(--shadow-button),var(--shadow-glow)]",
      },
      size: {
        sm: "h-7 rounded-sm px-3 text-[13px] leading-[18px]",
        md: "h-9 px-4 text-sm leading-5",
        lg: "h-11 px-5 text-[15px] leading-5",
        icon: "size-8 rounded-sm p-0",
      },
      block: { true: "w-full" },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "secondary",
  size = "md",
  block,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, block, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
