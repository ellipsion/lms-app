import {prisma} from "@/lib/db";
import {Attachment, Chapter} from "@prisma/client"

interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
}

export const getChapter = async ({userId, chapterId, courseId}: GetChapterProps) => {
    try {
        const purchase = await prisma.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        const chapter = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
                courseId,
                isPublished: true
            },
            include: {
                course: {
                    select: {
                        price: true
                    }
                }
            }
        })

        if (!chapter) {
            throw new Error("Chapter Not Found");
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;


        if (purchase) {
            attachments = await prisma.attachment.findMany({
                where: {
                    courseId: courseId,
                }
            })

            muxData = await prisma.muxData.findUnique({
                where: {
                    chapterId
                }
            })

            nextChapter = await prisma.chapter.findFirst({
                where: {
                    courseId,
                    isPublished: true,
                    position: {
                        gt: chapter.position
                    }
                },
                orderBy: {
                    position: "asc"
                }
            })
        }

        const userProgress  = await prisma.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        })

        return {
            chapter,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase
        }

    } catch (error) {
        console.log("[GET_CHAPTER]", error);
        return {
            chapter: null,
            muxData: null,
            attachments: null,
            nextChapter: null,
            userProgress: null,
            purchase: null
        }
    }
}