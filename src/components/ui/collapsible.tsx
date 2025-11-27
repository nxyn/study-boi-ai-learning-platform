"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * A component that can be collapsed or expanded.
 * @param {React.ComponentProps<typeof CollapsiblePrimitive.Root>} props - The props for the component.
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

/**
 * The trigger that toggles the collapsible content.
 * @param {React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>} props - The props for the component.
 */
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

/**
 * The content of the collapsible.
 * @param {React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>} props - The props for the component.
 */
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
