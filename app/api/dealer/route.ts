import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const dealerName =
      typeof body.dealerName === "string"
        ? body.dealerName.trim()
        : "";

    const shopName =
      typeof body.shopName === "string"
        ? body.shopName.trim()
        : "";

    const mobile =
      typeof body.mobile === "string"
        ? body.mobile.trim()
        : "";

    if (!dealerName || !shopName || !mobile) {
      return NextResponse.json(
        {
          error:
            "Dealer name, shop name and mobile are required",
        },
        { status: 400 }
      );
    }

    const ownerName =
      typeof body.ownerName === "string"
        ? body.ownerName.trim()
        : "";

    const whatsapp =
      typeof body.whatsapp === "string"
        ? body.whatsapp.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim()
        : "";

    const gstNumber =
      typeof body.gstNumber === "string"
        ? body.gstNumber.trim()
        : "";

    const address =
      typeof body.address === "string"
        ? body.address.trim()
        : "";

    const city =
      typeof body.city === "string"
        ? body.city.trim()
        : "";

    const state =
      typeof body.state === "string"
        ? body.state.trim()
        : "";

    const pincode =
      typeof body.pincode === "string"
        ? body.pincode.trim()
        : "";

    const dealerType =
      typeof body.dealerType === "string"
        ? body.dealerType.trim()
        : "";

    const existingBrands =
      typeof body.existingBrands === "string"
        ? body.existingBrands.trim()
        : "";

    const monthlyPurchase =
      typeof body.monthlyPurchase === "string"
        ? body.monthlyPurchase.trim()
        : "";

    const interestedProducts =
      typeof body.interestedProducts === "string"
        ? body.interestedProducts.trim()
        : "";

    const dealer = await prisma.dealer.create({
      data: {
        dealerName,
        shopName,
        mobile,
        ownerName,
        whatsapp,
        email,
        gstNumber,
        address,
        city,
        state,
        pincode,
        dealerType,
        existingBrands,
        monthlyPurchase,
        interestedProducts,
        salesRepresentative: "",
        status: "new",
        notes: "Submitted from website dealer registration form",
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: dealer.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/dealer failed:", error);

    return NextResponse.json(
      {
        error: "Failed to submit registration",
      },
      { status: 500 }
    );
  }
}