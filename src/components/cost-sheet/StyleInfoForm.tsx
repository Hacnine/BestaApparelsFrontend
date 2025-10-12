import { UseFormReturn } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useCheckStyleQuery } from "@/redux/api/costSheetApi";

interface StyleInfoFormProps {
  form?: UseFormReturn<any>;
  onStyleCheck?: (style: string) => void;
  isCheckingStyle?: boolean;
  styleExists?: boolean | null;
  creatorName?: string;
  mode?: "form" | "show";
  data?: any; // for show mode
}

const StyleInfoForm = ({
  form,
  onStyleCheck,
  isCheckingStyle,
  styleExists,
  creatorName,
  mode = "form",
  data = {},
}: StyleInfoFormProps) => {
  const isDisabled = styleExists === true;
  const stylePattern = /^[A-Za-z0-9-]+$/;
  const [styleError, setStyleError] = useState<string | null>(null);

  // If mode is "show", use data prop for values
  const isShowMode = mode === "show";
  const values = isShowMode
    ? {
        style: data.style,
        item: data.item,
        group: data.group,
        size: data.size,
        fabricType: data.fabricType,
        gsm: data.gsm,
        color: data.color,
        qty: data.quantity ?? data.qty,
      }
    : form?.watch ? form.watch() : {};

  // Only use watch and RTK query if not show mode and form is provided
  let styleValue = "";
  let styleCheckData, isStyleChecking, refetch;
  if (!isShowMode && form) {
    styleValue = form.watch("style");
    const query = useCheckStyleQuery(styleValue, {
      skip: !styleValue || !stylePattern.test(styleValue),
      refetchOnMountOrArgChange: true,
    });
    styleCheckData = query.data;
    isStyleChecking = query.isFetching;
    refetch = query.refetch;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="pt-5">
          <Label htmlFor="style">
            Style <span className="text-red-500">*</span>
          </Label>
          <Input
            id="style"
            value={values?.style ?? ""}
            readOnly
            placeholder="Enter style code"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="item">
            Item <span className="text-red-500">*</span>
          </Label>
          <Input
            id="item"
            value={values?.item ?? ""}
            readOnly
            placeholder="e.g., Baby Jogging Tops"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="group">
            Group <span className="text-red-500">*</span>
          </Label>
          <Input
            id="group"
            value={values?.group ?? ""}
            readOnly
            placeholder="e.g., Boys"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="size">
            Size <span className="text-red-500">*</span>
          </Label>
          <Input
            id="size"
            value={values?.size ?? ""}
            readOnly
            placeholder="e.g., 03/SS26"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="fabricType">
            Fabric Type <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fabricType"
            value={values?.fabricType ?? ""}
            readOnly
            placeholder="e.g., Fleece, 85% Cotton"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="gsm">
            GSM <span className="text-red-500">*</span>
          </Label>
          <Input
            id="gsm"
            value={values?.gsm ?? ""}
            readOnly
            placeholder="e.g., 320"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="color">
            Color <span className="text-red-500">*</span>
          </Label>
          <Input
            id="color"
            value={values?.color ?? ""}
            readOnly
            placeholder="e.g., 01X"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="qty">Quantity</Label>
          <Input
            id="qty"
            value={values?.qty ?? ""}
            readOnly
            placeholder="Enter quantity"
          />
        </div>
      </div>
      {/* No alerts in show mode */}
      {!isShowMode && (
        <>
          {/* Show alerts based on RTK Query result */}
          {styleCheckData?.exists === true && (
            <Alert className="border-warning bg-warning/10">
              <AlertCircle className="h-4 w-4 text-orange-700" />
              <AlertDescription className="text-warning-foreground text-orange-700">
                This style already exists. Created by:{" "}
                <strong>{styleCheckData.creatorName}</strong>
              </AlertDescription>
            </Alert>
          )}

          {styleCheckData?.exists === false && (
            <Alert className="border-success bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-green-700">
                Style is available. You can proceed with creating the cost sheet.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default StyleInfoForm;
