import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubmitButton({
  label = "Submit",
  isSubmitting,
}: {
  label?: string;
  isSubmitting: boolean;
}) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="font-bold w-full sm:w-auto"
    >
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}
