"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

import { ArrowUpDown, MoreHorizontal } from "lucide-react"

export type BillboardColumn = {
  id: string
  label: string;
  createdAt: string;
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <div className="flex justify-end"><CellAction data={row.original} /></div>
  },
];
