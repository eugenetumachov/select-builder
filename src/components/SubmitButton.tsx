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
      //   className="font-bold w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      className="font-bold w-full sm:w-auto"
    >
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}
