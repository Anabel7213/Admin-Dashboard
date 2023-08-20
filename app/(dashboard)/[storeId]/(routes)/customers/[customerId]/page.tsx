import prismadb from "@/lib/prismadb";

import { CustomerForm } from "./components/customer-form";

const CategoryPage = async ({
  params
}: {
  params: { customerId: string, storeId: string }
}) => {
  const customers = await prismadb.customer.findUnique({
    where: {
      id: params.customerId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CustomerForm initialData={customers} />
      </div>
    </div>
  );
}

export default CategoryPage;
