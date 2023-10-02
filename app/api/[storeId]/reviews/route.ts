import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    const body = await req.json();
    const { name, rating, content, productId, productName } = body;

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const inquiry = await prismadb.review.create({
      data: {
        name,
        rating,
        content,
        productId,
        productName,
        storeId: params.storeId,
      }
    });
  
    return NextResponse.json(inquiry);
  } catch (error) {
    console.log('[REVIEWS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const reviews = await prismadb.review.findMany({
      where: {
        storeId: params.storeId
      }
    });
  
    return NextResponse.json(reviews);
  } catch (error) {
    console.log('[REVIEWS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};