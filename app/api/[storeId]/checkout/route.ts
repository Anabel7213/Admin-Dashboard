import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const orderItems = await req.json();

  if (!orderItems || orderItems.length === 0) {
    return new NextResponse("Order items are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: orderItems.productIds
      }
    }
  });

  console.log(orderItems)

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'USD',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100
      }
    });
  });

  line_items.push({
    quantity: 1,
    price_data: {
      currency: 'USD',
      product_data: {
        name: 'Shipping Cost',
      },
      unit_amount: orderItems.shippingCost * 100,
    },
  });

  line_items.push({
    quantity: 1,
    price_data: {
      currency: 'USD',
      product_data: {
        name: 'State Tax',
      },
      unit_amount: orderItems.stateTax * 100,
    },
  });


  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: orderItems.productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId
            }
          },
          shippingType: orderItems.shippingType,
          shippingCost: orderItems.shippingCost.toString(),
          stateTax: orderItems.stateTax.toString(),
        }))
      }
    }
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["CA", "US", "MX"]
    },
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/?canceled=1`,
    metadata: {
      orderId: order.id
    },
  });

  return NextResponse.json({ url: session.url }, {
    headers: corsHeaders
  });
};
