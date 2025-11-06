"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface CustomProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  showText?: boolean;
  text?: string;
  isCooldown?: boolean;
  isReady?: boolean;
  textClass?: string; // Yeni eklenen prop
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CustomProgressProps
>(({ className, value, indicatorClassName, showText, text, isCooldown, isReady, textClass, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-6 w-full overflow-hidden rounded-full bg-gray-700 border border-gray-600 shadow-inner",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 transition-all duration-300 ease-out",
        indicatorClassName || "bg-primary",
        isCooldown && "opacity-50 animate-pulse-cooldown",
        isReady && "animate-pulse-ready"
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
    {showText && text && (
      <span className={cn(
        "absolute inset-0 flex items-center justify-center text-sm font-bold text-white z-10 drop-shadow-md",
        textClass // Yeni prop ile gelen sınıfı uygula
      )}>
        {text}
      </span>
    )}
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }