import { UseFormReturn } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface StyleInfoFormProps {
  form: UseFormReturn<any>;
  onStyleCheck: (style: string) => void;
  isCheckingStyle: boolean;
  styleExists: boolean | null;
  creatorName: string;
}

const StyleInfoForm = ({
  form,
  onStyleCheck,
  isCheckingStyle,
  styleExists,
  creatorName,
}: StyleInfoFormProps) => {
  const { register, watch } = form;
  const isDisabled = styleExists === true;
  const stylePattern = /^[A-Za-z]+-[A-Za-z0-9]+$/;
  const [styleError, setStyleError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="pt-5">
          <Label htmlFor="style">
            Style <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="style"
              {...register("style")}
              onBlur={(e) => {
                onStyleCheck(e.target.value);
                if (!stylePattern.test(e.target.value)) {
                  setStyleError(
                    "Style format must be like HJ-90 (letters-dash-numbers/letters)"
                  );
                } else {
                  setStyleError(null);
                }
              }}
              disabled={isDisabled}
              placeholder="Enter style code"
            />
            {isCheckingStyle && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {styleError && (
              <span className="absolute left-0 top-full mt-1 text-xs text-red-500">
                {styleError}
              </span>
            )}
          </div>
        </div>

        <div className="pt-5">
          <Label htmlFor="item">
            Item <span className="text-red-500">*</span>
          </Label>
          <Input
            id="item"
            {...register("item")}
            disabled={isDisabled}
            placeholder="e.g., Baby Jogging Tops"
          />
        </div>

        <div className="pt-5">
          <Label htmlFor="group">
            Group <span className="text-red-500">*</span>
          </Label>
          <Input
            id="group"
            {...register("group")}
            disabled={isDisabled}
            placeholder="e.g., Boys"
          />
        </div>

        <div className="pt-5">
          <Label htmlFor="size">
            Size <span className="text-red-500">*</span>
          </Label>
          <Input
            id="size"
            {...register("size")}
            disabled={isDisabled}
            placeholder="e.g., 03/SS26"
          />
        </div>

        <div className="pt-5">
          <Label htmlFor="fabricType">
            Fabric Type <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fabricType"
            {...register("fabricType")}
            disabled={isDisabled}
            placeholder="e.g., Fleece, 85% Cotton"
          />
        </div>

        <div className="pt-5">
          <Label htmlFor="gsm">
            GSM <span className="text-red-500">*</span>
          </Label>
          <Input
            id="gsm"
            {...register("gsm")}
            disabled={isDisabled}
            placeholder="e.g., 320"
          />
        </div>

        <div className="pt-5">
          <Label htmlFor="color">
            Color <span className="text-red-500">*</span>
          </Label>
          <Input
            id="color"
            {...register("color")}
            disabled={isDisabled}
            placeholder="e.g., 01X"
          />
        </div>

        <div className="pt-5">
          <Label htmlFor="qty">Quantity</Label>
          <Input
            id="qty"
            {...register("qty")}
            disabled={isDisabled}
            placeholder="Enter quantity"
          />
        </div>
      </div>

      {styleExists === true && (
        <Alert className="border-warning bg-warning/10">
          <AlertCircle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning-foreground">
            This style already exists. Created by:{" "}
            <strong>{creatorName}</strong>
          </AlertDescription>
        </Alert>
      )}

      {styleExists === false && (
        <Alert className="border-success bg-success/10">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-green-700">
            Style is available. You can proceed with creating the cost sheet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default StyleInfoForm;
