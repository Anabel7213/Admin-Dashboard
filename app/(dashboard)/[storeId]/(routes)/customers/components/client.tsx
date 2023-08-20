"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, CustomerColumn } from "./columns";

interface CustomersClientProps {
  data: CustomerColumn[];
}

export const CustomersClient: React.FC<CustomersClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Heading title={`Customers (${data.length})`} description="Manage your customers and prospects." />
        <Button onClick={() => router.push(`/${params.storeId}/customers/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="email" columns={columns} data={data} />
    </>
  );
};
