import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-custom-green text-white shadow hover:bg-custom-green-above active:scale-95 transition-all font-semibold",
        destructive:
          "bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90",
        outline:
          "border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 font-medium",
        secondary:
          "bg-custom-green-light text-custom-green shadow-sm hover:bg-custom-green-light/80 font-semibold",
        orange:
          "bg-custom-orange text-white shadow hover:bg-custom-orange-above active:scale-95 transition-all font-semibold",
        ghost: "hover:bg-slate-100 hover:text-slate-900 font-medium",
        link: "text-slate-900 underline-offset-4 hover:underline font-medium",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
