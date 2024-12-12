"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react"; // Impor ikon dari Lucide React

type Module = {
  ptmodul_id: number;
  ptmodul_name: string;
  ptmodul_link: string;
  ptmodul_icon: string;
  ptmodul_main: any;
};

export const columns: ColumnDef<Module>[] = [
  {
    accessorKey: "ptmodul_name",
    header: "Module Name",
  },
  {
    accessorKey: "ptmodul_link",
    header: "URL",
  },
  {
    accessorKey: "ptmodul_icon",
    header: "Icon",
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
                row.original.ptmodul_id,
                row.original.ptmodul_name,
                row.original.ptmodul_link,
                row.original.ptmodul_icon,
                row.original.ptmodul_main,
              )
            }
            className="flex items-center text-white bg-blue-500 hover:bg-blue-700 px-2 py-1 rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              meta.handleDelete(
                row.original.ptmodul_id,
                row.original.ptmodul_name,
                row.original.ptmodul_link,
                row.original.ptmodul_icon,
                row.original.ptmodul_main,
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

// const handleEdit = (user: Module) => {
//   console.log("Editing user:", user);
//   // Tambahkan logika untuk mengedit di sini.
// };

// const handleDelete = (user: Module) => {
//   console.log("Deleting user:", user);
//   // Tambahkan logika untuk menghapus di sini.
// };
