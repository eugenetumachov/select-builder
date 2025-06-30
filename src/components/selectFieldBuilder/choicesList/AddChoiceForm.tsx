import type React from "react";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MAX_CHOICE_LENGTH, MAX_CHOICES_NUMBER } from "../ChoicesList";

interface AddChoiceFormProps {
  choices: string[];
  hasError: boolean;
  onAddItem: (item: string) => void;
}

export function AddChoiceForm({
  choices,
  hasError,
  onAddItem,
}: AddChoiceFormProps) {
  const [newChoice, setNewChoice] = useState("");

  const handleAddButtonClick = () => {
    const trimmedChoice = newChoice.trim();

    if (
      trimmedChoice &&
      trimmedChoice.length <= MAX_CHOICE_LENGTH &&
      !choices.includes(trimmedChoice) &&
      choices.length < MAX_CHOICES_NUMBER
    ) {
      onAddItem(trimmedChoice);
      setNewChoice("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddButtonClick();
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="new-choice"
            value={newChoice}
            onChange={(e) => setNewChoice(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              choices.length >= MAX_CHOICES_NUMBER
                ? "Maximum choices reached"
                : "Enter choice..."
            }
            className={cn("flex-1", hasError && "border-red-500")}
            disabled={choices.length >= MAX_CHOICES_NUMBER}
          />

          {/* Fake value to highlight the out of range part */}
          {newChoice && (
            <div className="absolute inset-0 pointer-events-none flex items-center px-3 text-sm">
              <span className="bg-white">
                <span>{newChoice.slice(0, MAX_CHOICE_LENGTH)}</span>
                {newChoice.length > MAX_CHOICE_LENGTH && (
                  <span className="text-destructive bg-destructive/10">
                    {newChoice.slice(MAX_CHOICE_LENGTH)}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Add button */}
        <Button
          onClick={handleAddButtonClick}
          disabled={
            !newChoice.trim() ||
            newChoice.trim().length > MAX_CHOICE_LENGTH ||
            choices.includes(newChoice.trim()) ||
            choices.length >= MAX_CHOICES_NUMBER
          }
          size="icon"
          variant="secondary"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Hint / error message */}
      <div className="text-xs text-muted-foreground">
        {newChoice.trim().length > MAX_CHOICE_LENGTH ? (
          <span className="text-destructive">
            Name is too long (max {MAX_CHOICE_LENGTH} characters)
          </span>
        ) : choices.includes(newChoice.trim()) && newChoice.trim() ? (
          <span className="text-destructive">Item already exists</span>
        ) : (
          `Max ${MAX_CHOICES_NUMBER} items, ${MAX_CHOICE_LENGTH} characters per item`
        )}
      </div>
    </>
  );
}
