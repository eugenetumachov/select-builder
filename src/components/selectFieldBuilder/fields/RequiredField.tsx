import { Label } from "@/components/ui/label";

interface RequiredFieldProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function RequiredField({ value, onChange }: RequiredFieldProps) {
  return (
    <>
      <Label className="text-sm font-medium md:pt-2">Type</Label>
      <div className="md:col-span-2 py-2 flex items-center space-x-2">
        <div className="mr-4 text-sm">Multi-select</div>
        <input
          id="required"
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <Label
          htmlFor="required"
          className="text-sm font-medium cursor-pointer"
        >
          A value is required
        </Label>
      </div>
    </>
  );
}
