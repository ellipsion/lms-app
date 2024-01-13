import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import {prisma} from "@/lib/db"

export async function POST(req: Request) {
    try {
        const {userId} = auth()
        const {title} = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        if (!title) {
            return new NextResponse("Missing Fields", {status: 400})
        }

        const course = await prisma.course.create({
            data: {
                userId,
                title
            }
        })

        return NextResponse.json(course, {status: 201})

    } catch (error) {
        console.log("/api/courses [POST]", error);
        return new NextResponse("Internal server error", {status: 500})
    }
}