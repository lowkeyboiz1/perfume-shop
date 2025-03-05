"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
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

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  ripple?: boolean
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, isLoading, ripple = true, children, ...props }, ref) => {
  const [rippleEffect, setRippleEffect] = React.useState<{
    x: number
    y: number
    visible: boolean
  }>({ x: 0, y: 0, visible: false })

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!ripple) {
      props.onClick?.(event)
      return
    }

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    setRippleEffect({ x, y, visible: true })
    props.onClick?.(event)

    setTimeout(() => {
      setRippleEffect((prev) => ({ ...prev, visible: false }))
    }, 600)
  }

  return (
    <motion.button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} onClick={handleClick} whileTap={{ scale: 0.98 }} disabled={isLoading || props.disabled}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
      {rippleEffect.visible && ripple && (
        <motion.span
          className="absolute rounded-full bg-white/30"
          initial={{
            width: 0,
            height: 0,
            x: rippleEffect.x,
            y: rippleEffect.y,
            opacity: 0.5,
          }}
          animate={{
            width: 200,
            height: 200,
            x: rippleEffect.x - 100,
            y: rippleEffect.y - 100,
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />
      )}
    </motion.button>
  )
})
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton }
