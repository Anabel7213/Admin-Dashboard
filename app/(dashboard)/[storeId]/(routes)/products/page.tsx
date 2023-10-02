import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    isShipping: item.isShipping,
    weight: item.weight,
    shippingCost: item.shippingCost,
    price: formatter.format(item.price.toNumber()),
    cost: formatter.format(item.cost.toNumber()),
    profit: item.profit,
    margin: item.margin,
    category: item.category.name,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    width: item.width,
    height: item.height,
    material: item.material,
    condition: item.condition,
    brand: item.brand,
    compatibility: item.compatibility,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
