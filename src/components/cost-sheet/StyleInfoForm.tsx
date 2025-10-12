import { UseFormReturn } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
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

  // For edit mode, auto-fill form fields from data prop if present
  useEffect(() => {
    if (!isShowMode && data && form && form.setValue) {
      // Only set if values are different
      if (form.getValues("style") !== (data.style ?? ""))
        form.setValue("style", data.style ?? "");
      if (form.getValues("item") !== (data.item ?? ""))
        form.setValue("item", data.item ?? "");
      if (form.getValues("group") !== (data.group ?? ""))
        form.setValue("group", data.group ?? "");
      if (form.getValues("size") !== (data.size ?? ""))
        form.setValue("size", data.size ?? "");
      if (form.getValues("fabricType") !== (data.fabricType ?? ""))
        form.setValue("fabricType", data.fabricType ?? "");
      if (form.getValues("gsm") !== (data.gsm ?? ""))
        form.setValue("gsm", data.gsm ?? "");
      if (form.getValues("color") !== (data.color ?? ""))
        form.setValue("color", data.color ?? "");
      if (form.getValues("qty") !== (data.qty ?? data.quantity ?? ""))
        form.setValue("qty", data.qty ?? data.quantity ?? "");
    }
    // Only run when data or isShowMode changes
  }, [data, isShowMode]);

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
    : form?.watch
    ? form.watch()
    : {};

  // Always call the hook, but skip execution if not needed
  let styleValue = "";
  if (!isShowMode && form) {
    styleValue = form.watch("style");
  }
  const query = useCheckStyleQuery(styleValue, {
    skip: isShowMode || !styleValue || !stylePattern.test(styleValue),
    refetchOnMountOrArgChange: true,
  });
  const styleCheckData = query.data;
  const isStyleChecking = query.isFetching;
  const refetch = query.refetch;

  return (
    <div className="space-y-4">
      {isShowMode ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border p-2 bg-muted/30">Style</th>
                <th className="border p-2 bg-muted/30">Item</th>
                <th className="border p-2 bg-muted/30">Group</th>
                <th className="border p-2 bg-muted/30">Size</th>
                <th className="border p-2 bg-muted/30">Fabric Type</th>
                <th className="border p-2 bg-muted/30">GSM</th>
                <th className="border p-2 bg-muted/30">Color</th>
                <th className="border p-2 bg-muted/30">Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">{values?.style ?? ""}</td>
                <td className="border p-2">{values?.item ?? ""}</td>
                <td className="border p-2">{values?.group ?? ""}</td>
                <td className="border p-2">{values?.size ?? ""}</td>
                <td className="border p-2">{values?.fabricType ?? ""}</td>
                <td className="border p-2">{values?.gsm ?? ""}</td>
                <td className="border p-2">{values?.color ?? ""}</td>
                <td className="border p-2">{values?.qty ?? ""}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="pt-5">
            <Label htmlFor="style">
              Style <span className="text-red-500">*</span>
            </Label>
            <Input
              id="style"
              value={values?.style ?? ""}
              onChange={(e) =>
                form?.setValue && form.setValue("style", e.target.value)
              }
              readOnly={isDisabled}
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
              onChange={(e) =>
                form?.setValue && form.setValue("item", e.target.value)
              }
              readOnly={isDisabled}
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
              onChange={(e) =>
                form?.setValue && form.setValue("group", e.target.value)
              }
              readOnly={isDisabled}
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
              onChange={(e) =>
                form?.setValue && form.setValue("size", e.target.value)
              }
              readOnly={isDisabled}
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
              onChange={(e) =>
                form?.setValue && form.setValue("fabricType", e.target.value)
              }
              readOnly={isDisabled}
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
              onChange={(e) =>
                form?.setValue && form.setValue("gsm", e.target.value)
              }
              readOnly={isDisabled}
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
              onChange={(e) =>
                form?.setValue && form.setValue("color", e.target.value)
              }
              readOnly={isDisabled}
              placeholder="e.g., 01X"
            />
          </div>
          <div className="pt-5">
            <Label htmlFor="qty">Quantity</Label>
            <Input
              id="qty"
              value={values?.qty ?? ""}
              onChange={(e) =>
                form?.setValue && form.setValue("qty", e.target.value)
              }
              readOnly={isDisabled}
              placeholder="Enter quantity"
            />
          </div>
        </div>
      )}
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
                Style is available. You can proceed with creating the cost
                sheet.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default StyleInfoForm;

// No changes needed here for Card printing, see below.
