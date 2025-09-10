import { Users, UserCheck } from "lucide-react"; // Assuming these are from lucide-react for icons
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useGetUserStatsQuery } from "@/redux/api/userApi";
// Define the card configurations
const cardData = [
  {
    title: "Total Users",
    key: "total",
    icon: <Users className="h-8 w-8 text-primary" />,
  },
  {
    title: "Active Users",
    key: "active",
    icon: <UserCheck className="h-8 w-8 text-green-500" />,
  },
  {
    title: "Admins",
    key: "admin",
    icon: (
      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
        <span className="text-primary font-bold text-sm">A</span>
      </div>
    ),
  },
  {
    title: "Merchandisers",
    key: "merchandiser",
    icon: (
      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
        <span className="text-accent font-bold text-sm">M</span>
      </div>
    ),
  },
  {
    title: "Management",
    key: "management",
    icon: (
      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
        <span className="text-accent font-bold text-sm">MG</span>
      </div>
    ),
  },
  {
    title: "CAD",
    key: "cad",
    icon: (
      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
        <span className="text-accent font-bold text-sm">C</span>
      </div>
    ),
  },
  {
    title: "Sample Fabric",
    key: "sampleFabric",
    icon: (
      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
        <span className="text-accent font-bold text-sm">SF</span>
      </div>
    ),
  },
  {
    title: "Sample Room",
    key: "sampleRoom",
    icon: (
      <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
        <span className="text-accent font-bold text-sm">SR</span>
      </div>
    ),
  },
];

const RoleStats = () => {
  const { data: stats } = useGetUserStatsQuery({});
  // User stats fallback
  const roleSatistics = stats?.data || {};
  console.log(stats);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cardData.map((card) => (
        <Card key={card.key} className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {roleSatistics[card.key]}
                </p>
              </div>
              {card.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
export default RoleStats;
