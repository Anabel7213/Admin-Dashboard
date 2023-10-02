"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { ArrowUpDown } from "lucide-react";

export type InquiryColumn = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: string;
};

export const columns: ColumnDef<InquiryColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "subject",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Subject
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      let statusStyles = {};
      if (row.original.status === "New") {
        statusStyles = { backgroundColor: "#fff1f2", color: "#fb7185", border: "1px solid #fb7185" };
      } else if (row.original.status === "Received") {
        statusStyles = { backgroundColor: "#faf5ff", color: "#c084fc", border: "1px solid #c084fc"};
      } else if (row.original.status === "Pending") {
        statusStyles = { backgroundColor: "#fffbeb", color: "#fcd34d", border: "1px solid #fcd34d"};
      } else if (row.original.status === "Resolved") {
        statusStyles = { backgroundColor: "#f7fee7", color: "#3f6212", border: "1px solid #3f6212"};
      } else if (row.original.status === "On Hold") {
        statusStyles = { backgroundColor: "#eef2ff", color: "#a5b4fc", border: "1px solid #a5b4fc"};
      } else if (row.original.status === "Cancelled") {
        statusStyles = { backgroundColor: "#f1f5f9", color: "#94a3b8", border: "1px solid #94a3b8" };
      }
      return (
        <div className="px-2 py-1 text-center rounded-md" style={statusStyles}>
          {row.original.status}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Received
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <CellAction data={row.original} />
      </div>
    ),
  },
];
