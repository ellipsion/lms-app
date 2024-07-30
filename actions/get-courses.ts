import { Category, Chapter, Course } from "@prisma/client"
import {prisma} from "@/lib/db";
import { getProgress } from "./get-progress";


export type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: {id: Chapter["id"]}[];
    progress: number | null;
}

type GetCoursesOptions = {
    userId: string,
    title?: string,
    categoryId?: string,
}


export const getCourses = async ({userId, title, categoryId}: GetCoursesOptions): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await prisma.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title
                },
                categoryId
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
                purchases: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                createdAt: "desc" // latest
            }
        })

        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null
                    }
                }
                
                const progressPercentage = await getProgress(userId, course.id);
                
                return {
                    ...course,
                    progress: progressPercentage
                }
            })
        )

        return coursesWithProgress;

    } catch (error) {
        console.log("[GET COURSES ACTION]", error);
        return []
    }
}