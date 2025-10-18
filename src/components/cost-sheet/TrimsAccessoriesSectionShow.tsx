import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrimRow {
  id: string;
  description: string;
  cost: string;
}

interface TrimsAccessoriesSectionShowProps {
  data: any;
}

const TrimsAccessoriesSectionShow = ({ data }: TrimsAccessoriesSectionShowProps) => {
  const rows: TrimRow[] = Array.isArray(data?.rows) ? data.rows : [];
  const subtotal = rows.reduce((sum, row) => sum + (Number(row.cost) || 0), 0);

  return (
    <Card className="print:p-0 print:shadow-none print:border-none print:bg-white">
      <CardHeader className="print:p-0 print:mb-0 print:border-none print:bg-white">
        <CardTitle className="text-lg print:text-base print:mb-0">Trims & Accessories</CardTitle>
      </CardHeader>
      <CardContent className="print:p-0 print:space-y-0 print:bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Item Description</th>
                <th className="text-right p-3 font-medium">USD / Dozen</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3">{row.description}</td>
                  <td className="p-3 text-right">{Number(row.cost).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 space-y-3 pt-6 border-t-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Accessories Cost</span>
            <span className="font-semibold">
              ${Number(subtotal) ? Number(subtotal).toFixed(3) : "0.000"}
            </span>
          </div>
          <div className="flex justify-between items-center text-lg pt-3 border-t">
            <span className="font-bold">Total Accessories Cost</span>
            <span className="font-bold text-primary">
              ${Number(subtotal) ? Number(subtotal).toFixed(3) : "0.000"} /Dzn
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrimsAccessoriesSectionShow;
