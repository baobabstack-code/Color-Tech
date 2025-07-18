import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary dark:text-white mx-auto" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Loading...
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Please wait while we load your content
        </p>
      </div>
    </div>
  );
}
