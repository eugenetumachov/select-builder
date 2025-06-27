import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { SubmitButton } from "./components/SubmitButton";

interface FormData {
  label: string;
  required: boolean;
  defaultValue: string;
  choices: string;
  order: string;
}

interface FormErrors {
  label?: string;
}

export default function SelectFieldBuilder() {
  const [formData, setFormData] = useState<FormData>({
    label: "",
    required: false,
    defaultValue: "",
    choices: "",
    order: "alphabetical",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.label.trim()) {
      newErrors.label = "Label is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Form submitted:", formData);

    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setFormData({
      label: "",
      required: false,
      defaultValue: "",
      choices: "",
      order: "alphabetical",
    });
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto">
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
              <Label htmlFor="label" className="text-sm font-medium md:pt-2">
                Label <span className="text-red-500">*</span>
              </Label>
              <div className="md:col-span-2">
                <Input
                  id="label"
                  type="text"
                  value={formData.label}
                  onChange={(e) => handleInputChange("label", e.target.value)}
                  className={errors.label ? "border-red-500" : ""}
                  placeholder="Enter the label for the field"
                />
                {errors.label && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {errors.label}
                  </div>
                )}
              </div>
            </div>

            {/* Required */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <Label className="text-sm font-medium md:pt-2">Type</Label>
              <div className="md:col-span-2 py-2 flex items-center space-x-2">
                <div className="mr-4 text-sm">Multi-select</div>
                <input
                  id="required"
                  type="checkbox"
                  checked={formData.required}
                  onChange={(e) =>
                    handleInputChange("required", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label
                  htmlFor="required"
                  className="text-sm font-medium cursor-pointer"
                >
                  A value is required
                </Label>
              </div>
            </div>

            {/* Default value */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <Label
                htmlFor="defaultValue"
                className="text-sm font-medium md:pt-2"
              >
                Default Value
              </Label>
              <div className="md:col-span-2">
                <Input
                  id="defaultValue"
                  type="text"
                  value={formData.defaultValue}
                  onChange={(e) =>
                    handleInputChange("defaultValue", e.target.value)
                  }
                  placeholder="Enter the default value for the field"
                />
              </div>
            </div>

            {/* Choices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <Label htmlFor="choices" className="text-sm font-medium md:pt-2">
                Choices
              </Label>
              <div className="md:col-span-2">
                <Textarea
                  id="choices"
                  value={formData.choices}
                  onChange={(e) => handleInputChange("choices", e.target.value)}
                  placeholder="Enter the list of choices, one per line"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Order */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <Label className="text-sm font-medium md:pt-2">Order</Label>
              <div className="md:col-span-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      id="order-alphabetical"
                      type="radio"
                      name="order"
                      value="alphabetical"
                      checked={formData.order === "alphabetical"}
                      onChange={(e) =>
                        handleInputChange("order", e.target.value)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label
                      htmlFor="order-alphabetical"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Display choices in alphabetical order
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="order-user-specified"
                      type="radio"
                      name="order"
                      value="user-specified"
                      checked={formData.order === "user-specified"}
                      onChange={(e) =>
                        handleInputChange("order", e.target.value)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label
                      htmlFor="order-user-specified"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Keep the custom order
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center pt-6">
              <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
                <SubmitButton
                  label="Save changes"
                  isSubmitting={isSubmitting}
                />
                <span className="text-sm text-gray-500 hidden sm:inline">
                  or
                </span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full sm:w-auto bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
