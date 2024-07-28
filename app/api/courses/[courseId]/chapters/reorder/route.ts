import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PUT(req: Request, {params}: {params: {courseId: string}}) {
    try {
        const {userId} = auth();
        const {courseId} = params;
        const {list} = await req.json() as {list: { id: string; position: number }[]}

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        if (!list) {
            return new NextResponse("Missing values: no list", {status: 400})
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

        for (const item of list) {
            await prisma.chapter.update({
                where: {
                    id: item.id
                },
                data: {
                    position: item.position
                }
            })
        }

        return NextResponse.json({message: "chapters reorders successfully"});

    } catch (error) {
        console.log("/api/courses/{id}/chapters/reorder [PUT]", error)
        return new NextResponse("Internal server error", {status: 500})
    }
}
