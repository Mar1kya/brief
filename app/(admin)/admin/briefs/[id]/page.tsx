import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import BriefDetailsForm from "@/components/brief/brief-details-form"

export default async function BriefDetailsPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    const { id } = await params
    const brief = await prisma.brief.findUnique({
        where: { id: id }
    })
    if (!brief) {
        notFound()
    }
    return (
        <div className="container mx-auto py-10 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Управління заявкою</h1>
                <p className="text-muted-foreground">
                    Тут ви можете переглянути деталі проєкту та змінити статус обробки.
                </p>
            </div>
            <BriefDetailsForm brief={brief} />
        </div>
    )
}