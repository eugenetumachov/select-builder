import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/SubmitButton";
import { OrderField } from "./selectFieldBuilder/fields/OrderField";
import { ChoicesField } from "./selectFieldBuilder/fields/ChoicesField";
import { RequiredField } from "./selectFieldBuilder/fields/RequiredField";
import { LabelField } from "./selectFieldBuilder/fields/LabelField";

export interface FormData {
  label: string;
  required: boolean;
  choices: string[];
  default: string;
  order: "alphabetical" | "user-specified";
}

interface FormErrors {
  label?: string;
  choices?: string;
}

export default function SelectFieldBuilder() {
  const initialFormData: FormData = {
    label: "",
    required: false,
    choices: [],
    default: "",
    order: "alphabetical",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.label.trim()) {
      newErrors.label = "Label is required";
    }

    if (formData.choices.length === 0) {
      newErrors.choices = "Choices are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Submit the form data to API endpoint
    await fetch("https://webhook.site/b1971fb0-dd60-4fa4-b88b-ee04271da2db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log("Form submitted:", formData);

    setIsSubmitting(false);
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <div className="md:min-w-[640px]">
      <Card>
        <CardHeader className="p-3 bg-[#d9edf7] border-b rounded-t-lg">
          <CardTitle className="text-lg text-[#1f6d93]">
            Field Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Label */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <LabelField
                value={formData.label}
                error={errors.label}
                onChange={(value) => handleInputChange("label", value)}
              />
            </div>

            {/* Required */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <RequiredField
                value={formData.required}
                onChange={(value) => handleInputChange("required", value)}
              />
            </div>

            {/* Choices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <ChoicesField
                choices={formData.choices}
                default={formData.default}
                error={errors.choices}
                onChange={(choices) => handleInputChange("choices", choices)}
                onDefaultChange={(defaultValue) =>
                  handleInputChange("default", defaultValue)
                }
              />
            </div>

            {/* Order */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <OrderField
                value={formData.order}
                onChange={(value) =>
                  handleInputChange("order", value as FormData["order"])
                }
              />
            </div>

            {/* Action buttons */}
            <div className="flex justify-center pt-6">
              <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
                <SubmitButton
                  label="Save changes"
                  isSubmitting={isSubmitting}
                  className="font-bold w-full sm:w-auto"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="w-full sm:w-auto bg-transparent"
                >
                  Clear
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
