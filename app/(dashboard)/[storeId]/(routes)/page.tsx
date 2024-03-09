import { CreditCard, DollarSign, Package } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getStockCount } from "@/actions/get-stock-count";
import { formatter } from "@/lib/utils";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
};

const DashboardPage: React.FC<DashboardPageProps> = async ({ 
  params
}) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 px-4 py-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
          <Card className="sm:col-span-2 md:col-span-1">
            <CardHeader className="space-y-0 pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <div><DollarSign size={18} className="text-muted-foreground" /></div>
            </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader className="space-y-0 pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <div><CreditCard size={18} className="text-muted-foreground" /></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader className="space-y-0 pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-sm font-medium hidden md:block">Products In Stock</CardTitle>
              <CardTitle className="text-sm font-medium md:hidden">In Stock</CardTitle>
              <div><Package size={18} className="text-muted-foreground" /></div>
            </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
