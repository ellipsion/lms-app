import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


async function main() {
    try {
        await prisma.category.createMany({
            data: [
                {name: "Computer Science"},
                {name: "Photography"},
                {name: "Music"},
                {name: "Mathematics"},
                {name: "Accounting"},
                {name: "Fitness"},
            ]
        })

        console.log("[Prisma Seed Success]")
    } catch (error) {
        console.log("[Prisma Seed Error]", error)
    } finally {
        await prisma.$disconnect();
    }
} 

main()
 