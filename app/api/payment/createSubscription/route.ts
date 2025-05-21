import { razorpay } from "@/lib/razorpay";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: {
  json: () =>
    | PromiseLike<{ email: any; userId: any }>
    | { email: any; userId: any };
}) {
  try {
    const { email, userId } = await req.json();

    const planId = process.env.RAZORPAY_PLAN_ID;

    if (!planId) {
      return NextResponse.json(
        { error: "Missing Razorpay Plan ID" },
        { status: 500 }
      );
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12,
      notes: {
        email,
        userId,
      },
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error("Subscription Error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
