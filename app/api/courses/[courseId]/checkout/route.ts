import { auth, currentUser } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";



interface RouteParams {
    courseId: string;
}

export async function POST(req: Request, {params}: {params: RouteParams}) {
    try {
        const user = await currentUser();
        const userEmail = user?.emailAddresses?.[0]?.emailAddress;
        const {courseId} = params;

        if (!user || !user.id || !userEmail) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
                isPublished: true,
            }
        });
        
        const purchase = await prisma.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId
                }
            }
        })
        
        if (purchase) {
            return new NextResponse("Already purchased", {status: 400})
        }
        
        if (!course) {
            return new NextResponse("Not Found", {status: 404})
        }

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
            quantity: 1,
            price_data: {
                currency: "USD",
                product_data: {
                    name: course.title,
                    description: course.description!,
                    images: [course.imageUrl!]
                },
                unit_amount: Math.round(course.price! * 100)
            },
        }]

        let stripeCustomer = await prisma.stripeCustomer.findUnique({
            where: {
                userId: user.id
            },
            select: {
                stripeCustomerId: true
            }
        })

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: userEmail
            });

            stripeCustomer = await prisma.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                }
            })
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
            metadata: {
                userId: user.id,
                courseId: course.id
            }
        });

        return NextResponse.json({url: session.url});

    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}