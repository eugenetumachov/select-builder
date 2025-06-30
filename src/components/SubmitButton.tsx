import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  label?: string;
  isSubmitting: boolean;
  className?: string;
}

export function SubmitButton({
  label = "Submit",
  isSubmitting,
  className = "",
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isSubmitting} className={className}>
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}
