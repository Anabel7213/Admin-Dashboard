import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { inquiryId: string } }
) {
  try {
    if (!params.inquiryId) {
      return new NextResponse("Inquiry id is required", { status: 400 });
    }

    const inquiry = await prismadb.category.findUnique({
      where: {
        id: params.inquiryId
      }
    });
  
    return NextResponse.json(inquiry);
  } catch (error) {
    console.log('[INQUIRY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { inquiryId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.inquiryId) {
      return new NextResponse("Inquiry id is required", { status: 400 });
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

    const inquiry = await prismadb.inquiry.delete({
      where: {
        id: params.inquiryId,
      }
    });
  
    return NextResponse.json(inquiry);
  } catch (error) {
    console.log('[INQUIRY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { inquiryId: string, storeId: string } }
) {
  try {   
    const { userId } = auth();

    const body = await req.json();
    
    const { name, phone, email, message, subject, status } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.inquiryId) {
      return new NextResponse("Inquiry ID is required", { status: 400 });
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

    const inquiry = await prismadb.inquiry.update({
      where: {
        id: params.inquiryId,
      },
      data: {
        name,
        phone,
        email,
        message,
        subject,
        status
      }
    });
  
    return NextResponse.json(inquiry);
  } catch (error) {
    console.log('[INQUIRY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
