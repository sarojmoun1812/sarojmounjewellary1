import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

// Lazy initialization to avoid build-time errors
const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, orderId } = body;

    const options = {
      amount: amount, // amount in paise
      currency: "INR",
      receipt: orderId,
    };

    const razorpay = getRazorpay();
    const razorpayOrder = await razorpay.orders.create(options);

    return NextResponse.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return NextResponse.json({ verified: true });
    } else {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
