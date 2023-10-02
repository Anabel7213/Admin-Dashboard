import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { InquiryColumn } from "./components/columns"
import { InquiriesClient } from "./components/client";

const InquiriesPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const inquiries = await prismadb.inquiry.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedInquiries: InquiryColumn[] = inquiries.map((inquiry) => ({
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    subject: inquiry.subject,
    message: inquiry.message,
    status: inquiry.status,
    createdAt: format(inquiry.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <InquiriesClient inquiryData={formattedInquiries} />
      </div>
    </div>
  );
};

export default InquiriesPage;
