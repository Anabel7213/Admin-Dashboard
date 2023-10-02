"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, InquiryColumn } from "./columns";

interface InquiriesClientProps {
  inquiryData: InquiryColumn[];
}

export const InquiriesClient: React.FC<InquiriesClientProps> = ({
  inquiryData
}) => {

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Heading title={`Inquiries (${inquiryData.length})`} description="Respond to customer inquiries and resolve order issues." />
      </div>
      <Separator />
      <DataTable searchKey="subject" columns={columns} data={inquiryData} />
    </>
  );
};