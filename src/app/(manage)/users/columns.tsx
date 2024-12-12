"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react"; // Impor ikon dari Lucide React

type UserGroup = {
  ug_id: number;
  ug_group: string;
  ug_description: string;
  ug_isactive: string;
};

type Users = {
  usr_id: number;
  usr_user_group: number;
  usr_name: string;
  usr_username: string;
  usr_isactive: string;
  user_group: UserGroup;
};

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "usr_name",
    header: "Name",
  },
  {
    accessorKey: "usr_username",
    header: "Username",
  },
  {
    accessorKey: "user_group.ug_group",
    header: "Access",
  },
  {
    accessorKey: "usr_isactive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.usr_isactive === "Y";
      return (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Management",
    cell: ({ row, table }) => {
      const meta = table.options.meta as any;
      return (
        <div className="flex justify-evenly">
          <button
            onClick={() =>
              meta.handleEdit(
                row.original.usr_id,
                row.original.usr_name,
                row.original.usr_username,
                row.original.user_group.ug_id,
                row.original.usr_isactive
              )
            }
            className="flex items-center text-white bg-blue-500 hover:bg-blue-700 px-2 py-1 rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              meta.handleDelete(
                row.original.usr_id,
                row.original.usr_name,
                row.original.usr_username,
                row.original.user_group.ug_id,
                row.original.usr_isactive
              )
            }
            className="flex items-center text-white bg-red-500 hover:bg-red-700 px-2 py-1 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    },
  },
];

const handleEdit = (user: Users) => {
  console.log("Editing user:", user);
  // Tambahkan logika untuk mengedit di sini.
};

const handleDelete = (user: Users) => {
  console.log("Deleting user:", user);
  // Tambahkan logika untuk menghapus di sini.
};
