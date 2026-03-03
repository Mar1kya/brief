import { prisma } from "@/lib/prisma"
import { DataTable } from "@/components/admin/briefs/data-table";
import { columns } from "@/components/admin/briefs/columns";

export const metadata = {
    title: "Сторінка управління брифами",
    description: "Тут ви можете переглядати та редагувати статуси вхідних заявок."
}

export default async function AdminBriefsPage() {
    const briefs = await prisma.brief.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })
    return (
        <div className="container mx-auto py-10 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Управління брифами</h1>
                <p className="text-muted-foreground">
                    Тут ви можете переглядати та редагувати статуси вхідних заявок.
                </p>
            </div>
            <DataTable
                columns={columns}
                data={briefs}
                searchKey="companyName"
            />
        </div>
    )
}