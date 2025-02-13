"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function CopyButton({
  value,
  size,
  variant,
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={() => {
        navigator.clipboard.writeText(value)
        setCopied(true)
      }}
      {...props}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  )
}