"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export type ProductColumn = {
  id: string
  name: string;
  price: string;
  cost: string,
  profit: string,
  margin: string,
  quantity: number,
  category: string;
  size: string;
  color: string;
  width: string;
  height: string;
  material: string;
  condition: string;
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
  isShipping: boolean;
  weight: number,
  shippingCost: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({getValue}) => (getValue() ? "Yes" : "No")
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({getValue}) => (getValue() ? "Yes" : "No") //converts true/false to a user friendlier yes/no
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: "cost",
    header: ({ column }) => {
      return (
        <div className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ getValue }) => {const size = getValue(); return size == 0 ? "n/a" : size}
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {/* {row.original.color} */}
        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.color }} />
      </div>
    )
  },
  {
    accessorKey: "width",
    header: "Width",
    cell: ({ getValue }) => {const width = getValue(); return width == 0 ? "n/a" : width}
  },
  {
    accessorKey: "height",
    header: "Height",
    cell: ({ getValue }) => {const height = getValue(); return height == 0 ? "n/a" : height}
  },
  {
    accessorKey: "material",
    header: "Material",
    cell: ({ getValue }) => {const material = getValue(); return material == 0 ? "n/a" : material}
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ getValue }) => {const condition = getValue(); return condition == 0 ? "n/a" : condition}
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
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
