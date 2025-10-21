export const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <div className="text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  </div>
);

