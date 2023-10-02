import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    const body = await req.json();
    const { name, email, phone, status, message, subject } = body;

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

    const inquiry = await prismadb.inquiry.create({
      data: {
        name,
        email, 
        phone,
        status,
        subject,
        message,
        storeId: params.storeId,
      }
    });
  
    return NextResponse.json(inquiry);
  } catch (error) {
    console.log('[INQUIRIES_POST]', error);
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

    const inquiries = await prismadb.inquiry.findMany({
      where: {
        storeId: params.storeId
      }
    });
  
    return NextResponse.json(inquiries);
  } catch (error) {
    console.log('[INQUIRIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
