import prisma from "@/lib/prisma";  

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderName, selectedItems } = body;

    if (!orderName || !selectedItems?.length) {
      return NextResponse.json(
        { status: "ERROR", message: "Invalid data" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        orderName,
        items: {
          create: selectedItems.map((item: any) => ({
            stock_id: item.stock_id,
            name: item.name,
            description: item.description,
            price: Number(item.price),
            units: item.units,
            category_id: item.category_id ?? null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ status: "SUCCESS", order });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { status: "ERROR", message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ status: "SUCCESS", orders });
  } catch (error: any) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { status: "ERROR", message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}