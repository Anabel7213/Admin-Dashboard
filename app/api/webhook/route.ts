import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"
import prismadb from "@/lib/prismadb"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

  } catch (error: any) { 
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.shipping_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(', ');

  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        name: session?.customer_details?.name || "",
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
        email: session?.customer_details?.email || "",
      },
      include: {
        orderItems: true,
      }
    });

    console.log(order)
  }

  console.log(event.type)
  console.log("checkout.session.completed")
  console.log('Session:', session);
  console.log('Metadata OrderId:', session?.metadata?.orderId);

  return new NextResponse(null, { status: 200 });
};