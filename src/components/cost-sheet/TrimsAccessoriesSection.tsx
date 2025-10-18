import TrimsAccessoriesSectionCreate from "./TrimsAccessoriesSectionCreate";
import TrimsAccessoriesSectionEdit from "./TrimsAccessoriesSectionEdit";
import TrimsAccessoriesSectionShow from "./TrimsAccessoriesSectionShow";

interface TrimRow {
  id: string;
  description: string;
  cost: string;
}

interface TrimsAccessoriesSectionChange {
  rows: TrimRow[];
  json: any;
}

interface TrimsAccessoriesSectionProps {
  data: any;
  onChange?: (data: TrimsAccessoriesSectionChange) => void;
  mode?: "create" | "edit" | "show";
}

const TrimsAccessoriesSection = ({
  data,
  onChange,
  mode = "create",
}: TrimsAccessoriesSectionProps) => {
  if (mode === "show") {
    return <TrimsAccessoriesSectionShow data={data} />;
  }

  if (mode === "edit") {
    return <TrimsAccessoriesSectionEdit data={data} onChange={onChange} />;
  }

  if (mode === "create") {
    return <TrimsAccessoriesSectionCreate data={data} onChange={onChange} />;
  }

  return null;
};

export default TrimsAccessoriesSection;
