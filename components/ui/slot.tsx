"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

export interface SlotProps {
  children?: React.ReactNode
  asChild?: boolean
}

export function SlotClone({ children, asChild }: SlotProps) {
  if (asChild) {
    return <Slot>{children}</Slot>
  }
  return <>{children}</>
}