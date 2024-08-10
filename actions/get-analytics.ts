import { prisma } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCouse = Purchase & {
    course: Course;
}

const groupByCourse = (purchases: PurchaseWithCouse[]) => {
    const grouped: {[courseName: string]: number} = {}
    purchases.forEach(purchase => {
        const courseName = purchase.course.title;
        if (!grouped[courseName]) {
            grouped[courseName] = 0;
        }
        grouped[courseName] += purchase.course.price!
    });

    const data = Object.entries(grouped).map(([name, total]) => ({name, total}));

    return data
}

export const getAnalytics  = async (userId: string) => {
    try {
        const purchases = await prisma.purchase.findMany({
            where: {
                course: {
                    userId: userId
                },
            },
            include: {
                course: true
            },
        });

        const data = groupByCourse(purchases);

        const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
        const totalSales = purchases.length;

        return {
            data,
            totalRevenue,
            totalSales
        }

    } catch (error) {
        console.log("[GET_ANALYTICS]", error);
        return {
            data: [],
            totalRevenue: 0,
            totalSales: 0
        }
    }
}