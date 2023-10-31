import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import formatPhoneNumber from "@/lib/formatPhone";

import { OrderColumn } from "./components/columns"
import { OrderClient } from "./components/client";


const OrdersPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    fullName: item.fullName,
    phone: formatPhoneNumber(item.phone),
    email: item.email,
    address: item.address,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    shippingType: item.orderItems.map((orderItem) => orderItem.shippingType)[0],
    shippingCost: item.orderItems.map((orderItem) => orderItem.shippingCost)[0],
    stateTax: item.orderItems.map((orderItem) => orderItem.stateTax)[0],
    totalPrice: formatter.format(
      item.orderItems.reduce((total, orderItem) => total + Number(orderItem.product.price), 0) +
      Number(item.orderItems.map((orderItem) => orderItem.shippingCost)[0])
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
