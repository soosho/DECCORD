export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  )
}