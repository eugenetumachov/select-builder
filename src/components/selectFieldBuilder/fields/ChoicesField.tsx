import { Label } from "@/components/ui/label";
import { FormError } from "@/components/FormError";
import ChoicesList from "../ChoicesList";

interface ChoicesFieldProps {
  choices: string[];
  default: string;
  error?: string;
  onChange: (choices: string[]) => void;
  onDefaultChange: (value: string) => void;
}

export function ChoicesField({
  choices,
  default: defaultChoice,
  error,
  onChange,
  onDefaultChange,
}: ChoicesFieldProps) {
  return (
    <>
      <Label htmlFor="new-choice" className="text-sm font-medium md:pt-2">
        Choices <span className="text-red-500">*</span>
      </Label>
      <div className="md:col-span-2">
        <ChoicesList
          choices={choices}
          defaultChoice={defaultChoice}
          hasError={!!error}
          onItemsChange={(choices: string[]) => onChange(choices)}
          onSetDefault={(def: string) => onDefaultChange(def)}
        />
        {error && <FormError message={error} />}
      </div>
    </>
  );
}
