"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, ReviewColumn } from "./columns";

interface ReviewsClientProps {
  data: ReviewColumn[];
}

export const ReviewsClient: React.FC<ReviewsClientProps> = ({
  data,
}) => {

  return (
    <>
    <button onClick={() => console.log(data)}>test</button>
      <div className="flex items-center justify-between gap-4">
        <Heading title={`Reviews (${data.length})`} description="Respond to customer inquiries and resolve order issues." />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};