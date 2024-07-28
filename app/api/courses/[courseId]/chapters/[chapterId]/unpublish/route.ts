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

        const updatedChapter = await prisma.chapter.update({
                where: {
                    id: chapterId,
                    courseId
                },
                data: {
                    isPublished: false
                }
        })

        if (!updatedChapter) {
            return new NextResponse("Cannot publish chapter", {status: 400})
        }

        const publishedChaptersInCourse = await prisma.chapter.findMany({
            where: {
                courseId,
                isPublished: true
            }
        })

        if (!publishedChaptersInCourse.length) {
            await prisma.course.update({
                where: {
                    id: courseId
                }, data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(updatedChapter)

    } catch (error) {
        console.log("/api/courses/{id}/chapters/{id}/unpublish [PATCH]", error)
        return new NextResponse("Internal server error", {status: 500})
    }
}