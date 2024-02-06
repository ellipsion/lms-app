import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, {params}: {params: {courseId: string}}) {
    try {
        const {userId} = auth();
        const {courseId} = params;
        const {url} = await req.json()

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        if (!url) {
            return new NextResponse("Missing attachment url", {status: 400})
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

        const attachment = await prisma.attachment.create({
            data: {
                url,
                courseId,
                name: url.split("/").pop(),
            }
        })

        return NextResponse.json(attachment, {status: 201});

    } catch (error) {
        console.log("/api/courses/{id}/attachments [PATCH]", error)
        return new NextResponse("Internal server error", {status: 500})
    }
}