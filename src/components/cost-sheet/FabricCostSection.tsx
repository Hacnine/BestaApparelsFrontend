import FabricCostSectionCreate from "./FabricCostSectionCreate";
import FabricCostSectionEdit from "./FabricCostSectionEdit";
import FabricCostSectionShow from "./FabricCostSectionShow";

interface FabricCostSectionProps {
  data: any;
  onChange?: (data: any) => void;
  mode?: "create" | "edit" | "show";
}

const FabricCostSection = ({ data, onChange, mode = "create" }: FabricCostSectionProps) => {
  if (mode === "show") {
    return <FabricCostSectionShow data={data} />;
  }

  if (mode === "edit") {
    return <FabricCostSectionEdit data={data} onChange={onChange} />;
  }

  if (mode === "create") {
    return <FabricCostSectionCreate data={data} onChange={onChange} />;
  }

  return null;
};

export default FabricCostSection;
