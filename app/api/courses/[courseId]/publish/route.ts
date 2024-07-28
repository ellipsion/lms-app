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
        
        
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                },
            }
        })
        
        if (!course) {
            return new NextResponse("Not Found", {status: 404})
        }
        
        const haspublishedChapters = course.chapters.some(chapter => chapter.isPublished);
        
        if (!course.title || !course.description || !course.imageUrl || !course.price || !course.categoryId || !haspublishedChapters) {
            return new NextResponse("Missing required fields", {status: 400})
        }


        const updatedCourse = await prisma.course.update({
                where: {
                    id: courseId,
                    userId
                },
                data: {
                    isPublished: true
                }
        })

        if (!updatedCourse) {
            return new NextResponse("Cannot publish course", {status: 400})
        }

        return NextResponse.json(updatedCourse)

    } catch (error) {
        console.log("/api/courses/{id}/chapters/{id}/publish [PATCH]", error)
        return new NextResponse("Internal server error", {status: 500})
    }
}