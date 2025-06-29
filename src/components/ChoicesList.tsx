import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const MAX_CHOICES_NUMBER = 3;
export const MAX_CHOICE_LENGTH = 40;

interface ChoicesListProps {
  items: string[];
  defaultItem: string;
  hasError: boolean;
  onItemsChange: (items: string[]) => void;
  onSetDefault: (defaultItem: string) => void;
}

export default function ChoicesList({
  items,
  defaultItem,
  hasError,
  onItemsChange,
  onSetDefault,
}: ChoicesListProps) {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (
      newItem.trim() &&
      newItem.trim().length <= MAX_CHOICE_LENGTH &&
      !items.includes(newItem.trim()) &&
      items.length < MAX_CHOICES_NUMBER
    ) {
      const trimmedItem = newItem.trim();
      onItemsChange([...items, trimmedItem]);
      setNewItem("");

      // Set as default if it's the first item
      if (items.length === 0) {
        onSetDefault(trimmedItem);
      }
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    onItemsChange(items.filter((item) => item !== itemToRemove));

    // Clear default if removing the default item
    if (defaultItem === itemToRemove) {
      onSetDefault(
        items.length > 1
          ? items.find((item) => item !== itemToRemove) || ""
          : ""
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  return (
    <>
      {/* Add Item Form */}
      <div className="space-y-2 pb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="new-item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                items.length >= MAX_CHOICES_NUMBER
                  ? "Maximum items reached"
                  : "Enter item name..."
              }
              className={cn("flex-1", hasError && "border-red-500")}
              disabled={items.length >= MAX_CHOICES_NUMBER}
            />
            {newItem && (
              <div className="absolute inset-0 pointer-events-none flex items-center px-3 text-sm">
                <span className="bg-white">
                  <span>{newItem.slice(0, MAX_CHOICE_LENGTH)}</span>
                  {newItem.length > MAX_CHOICE_LENGTH && (
                    <span className="text-destructive bg-destructive/10">
                      {newItem.slice(MAX_CHOICE_LENGTH)}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
          <Button
            onClick={handleAddItem}
            disabled={
              !newItem.trim() ||
              newItem.trim().length > MAX_CHOICE_LENGTH ||
              items.includes(newItem.trim()) ||
              items.length >= MAX_CHOICES_NUMBER
            }
            size="icon"
            variant="secondary"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {newItem.trim().length > MAX_CHOICE_LENGTH ? (
              <span className="text-destructive">
                Item name too long (max {MAX_CHOICE_LENGTH} characters)
              </span>
            ) : items.includes(newItem.trim()) && newItem.trim() ? (
              <span className="text-destructive">Item already exists</span>
            ) : (
              `Max ${MAX_CHOICES_NUMBER} items, ${MAX_CHOICE_LENGTH} characters max`
            )}
          </span>
        </div>
      </div>

      {/* Items List */}
      {items.length > 0 && (
        <div className="space-y-4">
          <RadioGroup value={defaultItem} onValueChange={onSetDefault}>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2 border rounded-lg"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value={item} id={`item-${index}`} />
                    <Label
                      htmlFor={`item-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {item}
                    </Label>
                    {defaultItem === item && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      )}
    </>
  );
}
