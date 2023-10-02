import prismadb from "@/lib/prismadb";

import { InquiryForm } from "./components/inquiry-form";

const InquiryPage = async ({
  params
}: {
  params: { inquiryId: string, storeId: string }
}) => {
  const inquiries = await prismadb.inquiry.findUnique({
    where: {
      id: params.inquiryId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <InquiryForm initialData={inquiries} />
      </div>
    </div>
  );
}

export default InquiryPage;
