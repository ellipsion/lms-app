import { prisma } from "@/lib/db"
import { Category, Chapter, Course } from "@prisma/client"
import { promise } from "zod"
import { getProgress } from "./get-progress"

type CourseWithProgressWithCategory = Course & {
    category: Category,
    chapters: Chapter[],
    progress: number
}


type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory[],
    inProgressCourses: CourseWithProgressWithCategory[],
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try {
        const purchasedCourses = await prisma.purchase.findMany({
            where: {
                userId
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        }
                    }
                }
            }
        })

        const courses = await Promise.all(purchasedCourses.map(async (purchase) => {
            const course = purchase.course;
            const progress = await getProgress(userId, course.id);
            return {...course, progress} as CourseWithProgressWithCategory
        }))

        const completedCourses = courses.filter(course => course.progress === 100);
        const inProgressCourses = courses.filter(course => course.progress < 100);

        return {
            completedCourses,
            inProgressCourses
        }

    } catch (error) {
        console.log("[GET_DASHBOARD_COURSES]", error);
        return {
            completedCourses: [],
            inProgressCourses: []
        }
    }
}