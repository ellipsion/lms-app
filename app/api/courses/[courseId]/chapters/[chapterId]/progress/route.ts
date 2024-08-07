import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"


interface RouteParams {
    courseId: string; chapterId: string
}

export async function PUT(req: Request, {params}: {params: RouteParams}) {
    try {
        const {userId} = auth();
        const {courseId, chapterId} = params;
        const {isCompleted} = await req.json();

        if (!userId) {
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

        const userProgress = await prisma.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }, 
            update: {
                isCompleted
            },
            create: {
                userId,
                chapterId,
                isCompleted
            }
        })
        

        return NextResponse.json(userProgress);

    } catch (error) {
        console.log("/api/courses/{id}/chapters/{id}/progress [PUT]", error)
        return new NextResponse("Internal server error", {status: 500})
    }
}