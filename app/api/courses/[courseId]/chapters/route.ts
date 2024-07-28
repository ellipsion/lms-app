import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, {params}: {params: {courseId: string}}) {
    try {
        const {userId} = auth();
        const {courseId} = params;
        const {title} = await req.json()

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        if (!title) {
            return new NextResponse("Missing values: title", {status: 400})
        }
        
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if (!course) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const lastChapter = await prisma.chapter.findFirst({
            where: {
                courseId: course.id
            }, 
            orderBy: {
                position: "desc"
            }
        })

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const newChapter = await prisma.chapter.create({
            data: {
                title,
                courseId,
                position: newPosition
            }
        })

        return NextResponse.json(newChapter);

    } catch (error) {
        console.log("/api/courses/{id}/chapters [POST]", error)
        return new NextResponse("Internal server error", {status: 500})
    }
}
