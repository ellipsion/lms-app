import { prisma } from "@/lib/db"
import { mux } from "@/lib/mux";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

const {video} = mux;


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

export async function DELETE(req: Request, {params}: {params: {courseId: string}}) {
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
                        muxData: {
                            select: {
                                id: true,
                                assetId: true
                            }
                        }
                    },
                }
            }
        });

        if (!course) {
            return new NextResponse("Course not found.", {status: 400})
        }

        await Promise.all(
            course.chapters.map(async (chapter) => {
                if (chapter.videoUrl) {
                    if (chapter.muxData) {
                        await video.assets.delete(chapter.muxData.assetId);
                        await prisma.muxData.delete({
                            where: {
                                id: chapter.muxData.id
                            }
                        })
                    }
                }
            })
        )

        const deletedCourse = await prisma.course.delete({
            where: {
                id: courseId,
                userId
            }
        })

        return NextResponse.json(deletedCourse)

    } catch (error) {
        console.log("/api/courses/{id} [DELETE]", error)
        return new NextResponse("Internal server error", {status: 500})
    }
}