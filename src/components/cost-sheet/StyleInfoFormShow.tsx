interface StyleInfoFormShowProps {
  data: any;
}

const StyleInfoFormShow = ({ data }: StyleInfoFormShowProps) => {
  return (
    <div className="space-y-4">
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
              <td className="border p-2 uppercase">{data?.style ?? ""}</td>
              <td className="border p-2">{data?.item ?? ""}</td>
              <td className="border p-2">{data?.group ?? ""}</td>
              <td className="border p-2">{data?.size ?? ""}</td>
              <td className="border p-2">{data?.fabricType ?? ""}</td>
              <td className="border p-2">{data?.gsm ?? ""}</td>
              <td className="border p-2">{data?.color ?? ""}</td>
              <td className="border p-2">{data?.quantity ?? data?.qty ?? ""}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StyleInfoFormShow;
