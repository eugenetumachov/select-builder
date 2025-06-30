import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface OrderFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function OrderField({ value, onChange }: OrderFieldProps) {
  return (
    <>
      <Label className="text-sm font-medium md:pt-2">Order</Label>
      <div className="md:col-span-2 space-y-2">
        <RadioGroup value={value} onValueChange={onChange}>
          <div className="flex items-center space-x-2 flex-1">
            <RadioGroupItem value="alphabetical" id="order-alphabetical" />
            <Label
              htmlFor="order-alphabetical"
              className="text-sm font-medium cursor-pointer"
            >
              Display choices in alphabetical order
            </Label>
          </div>

          <div className="flex items-center space-x-2 flex-1">
            <RadioGroupItem value="user-specified" id="order-user-specified" />
            <Label
              htmlFor="order-user-specified"
              className="text-sm font-medium cursor-pointer"
            >
              Keep the custom order
            </Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );
}
