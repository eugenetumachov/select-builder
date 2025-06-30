import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/FormError";

interface LabelFieldProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function LabelField({ value, error, onChange }: LabelFieldProps) {
  return (
    <>
      <Label htmlFor="label" className="text-sm font-medium md:pt-2">
        Label <span className="text-red-500">*</span>
      </Label>
      <div className="md:col-span-2">
        <Input
          id="label"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={error ? "border-red-500" : ""}
          placeholder="Enter the label for the field..."
        />
        {error && <FormError message={error} />}
      </div>
    </>
  );
}
