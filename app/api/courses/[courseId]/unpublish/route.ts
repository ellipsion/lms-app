import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"


interface RouteParams {
    courseId: string;
}

export async function PATCH(req: Request, {params}: {params: RouteParams}) {
    try {
        const {userId} = auth();
        const {courseId} = params;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        const unpublishedCourse = await prisma.course.update({
                where: {
                    id: courseId,
                    userId
                },
                data: {
                    isPublished: false
                }
        })

        if (!unpublishedCourse) {
            return new NextResponse("Cannot unpublish course", {status: 400})
        }

        return NextResponse.json(unpublishedCourse)

    } catch (error) {
        console.log("/api/courses/{id}/unpublish [PATCH]", error)
        return new NextResponse("Internal server error", {status: 500})
    }
}