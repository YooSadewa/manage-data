"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react"; // Impor ikon dari Lucide React
import { useState } from "react";

type UserGroup = {
  ug_id: number;
  ug_group: string;
  ug_description: string;
  ug_isactive: string;
};

// const [selectedUser, setSelectedUser] = useState(null);

export const columns: ColumnDef<UserGroup>[] = [
  {
    accessorKey: "ug_group",
    header: "Name Group",
  },
  {
    accessorKey: "ug_description",
    header: "Description",
  },
  {
    accessorKey: "ug_isactive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.ug_isactive === "Y";
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
                row.original.ug_id,
                row.original.ug_group,
                row.original.ug_description,
                row.original.ug_isactive
              )
            }
            className="flex items-center text-white bg-blue-500 hover:bg-blue-700 px-2 py-1 rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              meta.handleDelete(
                row.original.ug_id,
                row.original.ug_group,
                row.original.ug_description,
                row.original.ug_isactive
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

// const handleEdit = (user: UserGroup) => {
//   console.log("Editing user:", user);
//   <>
//     <dialog id="my_modal_3" className="modal">
//       <div className="modal-box">
//         <form method="dialog">
//           <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
//             ✕
//           </button>
//         </form>
//         <h3 className="font-bold text-lg">Hello!</h3>
//         <p className="py-4">Press ESC key or click on ✕ button to close</p>
//       </div>
//     </dialog>
//   </>;
// };

// const handleDelete = (user: UserGroup) => {
//   console.log("Deleting user:", user);
//   // Tambahkan logika untuk menghapus di sini.
// };
