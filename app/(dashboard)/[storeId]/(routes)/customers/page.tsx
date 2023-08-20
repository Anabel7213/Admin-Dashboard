import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { CustomerColumn } from "./components/columns"
import { CustomersClient } from "./components/client";

const CustomersPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const customers = await prismadb.customer.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedCustomers: CustomerColumn[] = customers.map((customer) => ({
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    consent: customer.consent,
    country: customer.country,
    company: customer.company,
    address: customer.address,
    apt: customer.apt,
    city: customer.city,
    state: customer.state,
    zip: customer.zip,
    secondaryPhone: customer.secondaryPhone,
    notes: customer.notes,
    createdAt: format(customer.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CustomersClient data={formattedCustomers} />
      </div>
    </div>
  );
};

export default CustomersPage;
