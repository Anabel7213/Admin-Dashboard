import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { ReviewColumn } from "./components/columns"
import { ReviewsClient } from "./components/client";

const ReviewsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const reviews = await prismadb.review.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedInquiries: ReviewColumn[] = reviews.map((review) => ({
    id: review.id,
    name: review.name,
    content: review.content,
    rating: review.rating,
    productId: review.productId,
    productName: review.productName,
    response: review.response,
    createdAt: format(review.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ReviewsClient data={formattedInquiries} />
      </div>
    </div>
  );
};

export default ReviewsPage;
