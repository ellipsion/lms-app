import { auth, currentUser } from "@clerk/nextjs"
import { NextResponse,  } from "next/server";

import { prisma } from "@/lib/db"
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";



interface RouteParams {
    courseId: string;
}

export async function POST(req: Request, {params}: {params: RouteParams}) {
    try {
        const body = await req.text()
        const signature = req.headers.get("Stripe-Signature") as string;

        let event: Stripe.Event;
        
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )

        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session?.metadata?.userId
        const courseId = session?.metadata?.courseId

        if (event.type !== "checkout.session.completed") {
            return new NextResponse(`Webhook Error: Unhandled Event Type ${event.type}`, {status: 200})
        } 

        if (!userId || !courseId) {
            return new NextResponse(`Webhook Error: Missing Metadata`, {status: 400})
        }
        
        await prisma.purchase.create({
            data: {
                userId,
                courseId
            }
        })
        
        return new NextResponse(null, {status: 200})
        
    } catch (error: any) {
        console.log("[STRIPE_WEBHOOK_ERROR]", error);
        return new NextResponse(`Webhook Error: ${error.message}`, {status: 400})
    }
}