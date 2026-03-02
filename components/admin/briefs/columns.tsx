"use client"
import { useState, useEffect } from "react" 
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, FileText, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Brief } from "@/lib/generated/prisma"

const getStatusBadge = (status: string) => {
  switch (status) {
    case "NEW": return <Badge variant="default" className="bg-blue-500">Новий</Badge>
    case "IN_REVIEW": return <Badge variant="secondary" className="bg-yellow-500 text-white">В обробці</Badge>
    case "ACCEPTED": return <Badge variant="default" className="bg-emerald-500">Укладено</Badge>
    case "REJECTED": return <Badge variant="destructive">Відхилено</Badge>
    default: return <Badge variant="outline">{status}</Badge>
  }
}
const FormattedDate = ({ dateValue }: { dateValue: any }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="text-sm text-muted-foreground pl-4">...</div>;
  }

  const date = new Date(dateValue);
  return (
    <div className="text-sm text-muted-foreground pl-4">
      {date.toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })}
    </div>
  );
};


export const columns: ColumnDef<Brief>[] = [
  {
    accessorKey: "companyName",
    header: "Компанія / Проєкт",
    filterFn: (row, _columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const company = row.original.companyName.toLowerCase();
      const name = row.original.customerName.toLowerCase();
      return company.includes(search) || name.includes(search);
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium truncate">{row.original.companyName}</span>
        <span className="text-xs text-muted-foreground truncate">{row.original.customerName}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }) => getStatusBadge(row.original.status || "NEW"),
  },
  {
    accessorKey: "phone",
    header: "Контакти",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 text-sm">
        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-muted-foreground" /> {row.original.phone}</span>
        <a href={`mailto:${row.original.email}`} className="text-blue-500 hover:underline text-xs">{row.original.email}</a>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Дата подачі
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <FormattedDate dateValue={row.getValue("createdAt")} />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const brief = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Відкрити меню</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Дії з брифом</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/briefs/${brief.id}`} className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                Деталі та Редагування
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]