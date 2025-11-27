"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * An image element with a fallback for representing the user.
 * @param {React.ComponentProps<typeof AvatarPrimitive.Root>} props - The props for the component.
 * @param {string} [props.className] - Additional CSS classes to apply to the component.
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

/**
 * The image of the avatar.
 * @param {React.ComponentProps<typeof AvatarPrimitive.Image>} props - The props for the component.
 * @param {string} [props.className] - Additional CSS classes to apply to the component.
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

/**
 * The fallback for the avatar if the image is not available.
 * @param {React.ComponentProps<typeof AvatarPrimitive.Fallback>} props - The props for the component.
 * @param {string} [props.className] - Additional CSS classes to apply to the component.
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
