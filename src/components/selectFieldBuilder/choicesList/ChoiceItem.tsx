import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

interface ChoiceItemProps {
  item: string;
  index: number;
  default: boolean;
  onRemoveItem: (item: string) => void;
}

export function ChoiceItem({
  item,
  index,
  default: isDefault,
  onRemoveItem,
}: ChoiceItemProps) {
  return (
    <div className="flex items-center justify-between gap-2 p-2 border rounded-lg">
      <div className="flex items-center space-x-2 flex-1">
        <RadioGroupItem value={item} id={`item-${index}`} />
        <Label htmlFor={`item-${index}`} className="flex-1 cursor-pointer">
          {item}
        </Label>
        {/* "Default" badge */}
        {isDefault && (
          <Badge variant="secondary" className="text-xs">
            Default
          </Badge>
        )}
      </div>
      {/* Remove button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemoveItem(item)}
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
