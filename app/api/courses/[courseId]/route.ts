import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, {params}: {params: {courseId: string}}) {
    try {
        const {userId} = auth();
        const {courseId} = params;
        const values = await req.json()

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        if (!values) {
            return new NextResponse("Missing values", {status: 400})
        }
        
        const course = await prisma.course.update({
            where: {
                id: courseId,
                userId
            }, data: {
                ...values
            }
        })

        if (!course) {
            return new NextResponse("Course not found.", {status: 404})
        }

        return NextResponse.json(course)

    } catch (error) {
        console.log("/api/courses/{id} [PATCH]", error)
        return new NextResponse("Internal server error", {status: 500})
    }
}