import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"


interface RouteParams {
    courseId: string; chapterId: string
}

export async function PATCH(req: Request, {params}: {params: RouteParams}) {
    try {
        const {userId} = auth();
        const {courseId, chapterId} = params;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId
            },
        })
        
        if (!course) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        const chapter = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
                courseId
            },
        })
        
        if (!chapter) {
            return new NextResponse("Not Found", {status: 404})
        }
        
        if (!chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Cannot publish chapter", {status: 400})
        }

        const updatedChapter = await prisma.chapter.update({
                where: {
                    id: chapterId,
                    courseId
                },
                data: {
                    isPublished: true
                }
        })

        if (!updatedChapter) {
            return new NextResponse("Cannot publish chapter", {status: 400})
        }

        return NextResponse.json(updatedChapter)

    } catch (error) {
        console.log("/api/courses/{id}/chapters/{id}/publish [PATCH]", error)
        return new NextResponse("Internal server error", {status: 500})
    }
}