import { UseFormReturn } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useCheckStyleQuery } from "@/redux/api/costSheetApi";

interface StyleInfoFormCreateProps {
  form: UseFormReturn<any>;
}

const StyleInfoFormCreate = ({ form }: StyleInfoFormCreateProps) => {
  const stylePattern = /^[A-Za-z0-9-]+$/;
  const values = form.watch();
  const styleValue = form.watch("style");

  const { data: styleCheckData } = useCheckStyleQuery(styleValue, {
    skip: !styleValue || !stylePattern.test(styleValue),
    refetchOnMountOrArgChange: true,
  });
console.log(styleCheckData)
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
            onChange={(e) => form.setValue("style", e.target.value)}
            className="uppercase"
            placeholder="Enter style codef"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="item">
            Item <span className="text-red-500">*</span>
          </Label>
          <Input
            id="item"
            value={values?.item ?? ""}
            onChange={(e) => form.setValue("item", e.target.value)}
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
            onChange={(e) => form.setValue("group", e.target.value)}
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
            onChange={(e) => form.setValue("size", e.target.value)}
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
            onChange={(e) => form.setValue("fabricType", e.target.value)}
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
            onChange={(e) => form.setValue("gsm", e.target.value)}
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
            onChange={(e) => form.setValue("color", e.target.value)}
            placeholder="e.g., 01X"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="qty">Quantity</Label>
          <Input
            id="qty"
            value={values?.qty ?? ""}
            onChange={(e) => form.setValue("qty", e.target.value)}
            placeholder="Enter quantity"
          />
        </div>
      </div>

      {/* Style validation alerts */}
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
          <CheckCircle2 className="h-4 w-4 text-green-700" />
          <AlertDescription className="text-green-700">
            Style is available. You can proceed with creating the cost sheet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default StyleInfoFormCreate;
