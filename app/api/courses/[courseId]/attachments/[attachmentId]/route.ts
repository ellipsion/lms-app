import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

type DeleteParams = {
    params: {
    courseId: string,
    attachmentId: string
    }
}

export async function DELETE(req: Request, {params}: DeleteParams) {
    try {
        const {userId} = auth();
        const {courseId, attachmentId} = params;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        
        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId
            },
        })

        if (!courseOwner) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const attachment = await prisma.attachment.delete({
            where: {
                id: attachmentId,
                courseId
            }
        })

        return NextResponse.json(attachment, {status: 200});

    } catch (error) {
        console.log("/api/courses/{id}/attachments [PATCH]", error)
        return new NextResponse("Internal server error", {status: 500})
    }
}