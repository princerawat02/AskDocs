import { cn } from "../../lib/utils";

export function Input({ label, className, labelClassName, ...props }) {
  return (
    <label
      className={cn(
        "grid gap-2 text-sm font-medium text-foreground",
        labelClassName,
      )}
    >
      {label && <span>{label}</span>}
      <input
        data-slot="input"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </label>
  );
}
