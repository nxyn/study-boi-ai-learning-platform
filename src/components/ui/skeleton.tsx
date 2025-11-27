import { cn } from "@/lib/utils"

/**
 * A skeleton loader.
 * @param {React.ComponentProps<"div">} props - The props for the component.
 * @param {string} [props.className] - Additional CSS classes to apply to the component.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
