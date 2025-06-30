import { AlertCircle } from "lucide-react";

export function FormError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
      <AlertCircle className="h-4 w-4" />
      {message}
    </div>
  );
}
