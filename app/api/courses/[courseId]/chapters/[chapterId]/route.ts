
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { mux } from "@/lib/mux";

const {video} = mux;

interface RouteParams {
    courseId: string; chapterId: string
}

export async function PATCH(req: Request, {params}: {params: RouteParams}) {
    try {
        const {userId} = auth();
        const {courseId, chapterId} = params;
        const {isPublished, ...values} = await req.json()

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        if (!values) {
            return new NextResponse("Missing values", {status: 400})
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

        const chapter = await prisma.chapter.update({
            where: {
                id: chapterId,
                courseId
            },
            data: {
                ...values
            }
        })

        // Handle video upload

        if (values.videoUrl) {
            console.log(values.videoUrl);
            const existingMuxData = await prisma.muxData.findUnique({where: {chapterId}});

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await prisma.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }

            // create new video asset
            const asset = await video.assets.create({
                input: values.videoUrl,
                playback_policy: ["public"],
                test: false
            })

            // register the asset in database
            await prisma.muxData.create({data: {
                assetId: asset.id,
                playbackId: asset.playback_ids?.[0]?.id,
                chapterId,
            }})
        }


        return NextResponse.json(chapter)

    } catch (error) {
        console.log("/api/courses/{id}/chapters/{id} [PATCH]", error)
        return new NextResponse("Internal server error", {status: 500})
    }
}

export async function DELETE(req: Request, {params}: {params: RouteParams}) {
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
            }
        })

        if (!chapter){
            return new NextResponse("Not Found", {status: 404});
        }


        if (chapter.videoUrl) {
            const existingMuxData = await prisma.muxData.findUnique({where: {chapterId}});

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await prisma.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }
        }

        const deletedChapter = await prisma.chapter.delete({
            where: {
                id: chapterId,
                courseId
            }
        })

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

        return NextResponse.json(deletedChapter)

    } catch (error) {
        console.log("/api/courses/{id}/chapters/{id} [DELETE]", error)
        return new NextResponse("Internal server error", {status: 500})
    }
}