import { RadioGroup } from "@/components/ui/radio-group";
import { ChoiceItem } from "./choicesList/ChoiceItem";
import { AddChoiceForm } from "./choicesList/AddChoiceForm";

export const MAX_CHOICES_NUMBER = 50;
export const MAX_CHOICE_LENGTH = 40;

interface ChoicesListProps {
  choices: string[];
  defaultChoice: string;
  hasError: boolean;
  onItemsChange: (items: string[]) => void;
  onSetDefault: (defaultItem: string) => void;
}

export default function ChoicesList({
  choices,
  defaultChoice,
  hasError,
  onItemsChange,
  onSetDefault,
}: ChoicesListProps) {
  const handleAddItem = (item: string) => {
    // Set as default if it's the first item
    if (choices.length === 0) {
      onSetDefault(item);
    }

    onItemsChange([...choices, item]);
  };

  const handleRemoveItem = (itemToRemove: string) => {
    onItemsChange(choices.filter((item) => item !== itemToRemove));

    // Clear default if removing the default item
    if (defaultChoice === itemToRemove) {
      onSetDefault(
        choices.length > 1
          ? choices.find((item) => item !== itemToRemove) || ""
          : ""
      );
    }
  };

  return (
    <>
      {/* Add choice form */}
      <div className="space-y-2 pb-4">
        <AddChoiceForm
          choices={choices}
          hasError={hasError}
          onAddItem={handleAddItem}
        />
      </div>

      {/* Choices list */}
      {choices.length > 0 && (
        <div className="space-y-4">
          <RadioGroup value={defaultChoice} onValueChange={onSetDefault}>
            <div className="space-y-2">
              {choices.map((choice, index) => (
                <ChoiceItem
                  key={index}
                  item={choice}
                  index={index}
                  default={choice === defaultChoice}
                  onRemoveItem={handleRemoveItem}
                />
              ))}
            </div>
          </RadioGroup>
        </div>
      )}
    </>
  );
}
