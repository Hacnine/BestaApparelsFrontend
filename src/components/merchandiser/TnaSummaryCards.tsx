import React from "react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";

type TnaCardConfigItem = {
  status: string;
  key: string;
  color: string;
  textColor: string;
  icon: React.ReactNode;
};

type TnaSummaryCardsProps = {
  tnaCardConfig: TnaCardConfigItem[];
  summaryCardData: Record<string, number>;
};

const TnaSummaryCards: React.FC<TnaSummaryCardsProps> = ({
  tnaCardConfig,
  summaryCardData,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {tnaCardConfig.map((item) => {
      const count = summaryCardData?.[item.key] ?? 0;
      const total = summaryCardData?.total ?? 1;
      const percentage = total ? Math.round((count / total) * 100) : 0;
      return (
        <Card
          key={item.status}
          className="bg-gradient-card border-0 shadow-md"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.status} TNAs
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {count}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${item.color}`}>
                {item.icon}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Progress value={percentage} className="flex-1" />
              <span className={`text-sm font-medium ${item.textColor}`}>
                {percentage}%
              </span>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
);

export default TnaSummaryCards;
