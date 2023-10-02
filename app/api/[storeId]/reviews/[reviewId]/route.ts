import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    if (!params.reviewId) {
      return new NextResponse("Inquiry id is required", { status: 400 });
    }

    const review = await prismadb.review.findUnique({
      where: {
        id: params.reviewId
      }
    });
  
    return NextResponse.json(review);
  } catch (error) {
    console.log('[REVIEW_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { reviewId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const review = await prismadb.review.delete({
      where: {
        id: params.reviewId,
      }
    });
  
    return NextResponse.json(review);
  } catch (error) {
    console.log('[REVIEW_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { reviewId: string, storeId: string } }
) {
  try {   
    const { userId } = auth();

    const body = await req.json();
    
    const { name, rating, content, response, productName, productId } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const review = await prismadb.review.update({
      where: {
        id: params.reviewId,
      },
      data: {
        name,
        content,
        rating,
        response,
        productId,
        productName
      }
    });
  
    return NextResponse.json(review);
  } catch (error) {
    console.log('[REVIEW_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
