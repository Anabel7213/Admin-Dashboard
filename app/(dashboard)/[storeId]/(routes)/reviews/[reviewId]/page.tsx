import prismadb from "@/lib/prismadb";

import { ReviewForm } from "./components/reviews-form";

const ReviewsPage = async ({
  params
}: {
  params: { reviewId: string, storeId: string }
}) => {
  const reviews = await prismadb.review.findUnique({
    where: {
      id: params.reviewId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ReviewForm initialData={reviews} />
      </div>
    </div>
  );
}

export default ReviewsPage;
