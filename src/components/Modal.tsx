import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface ModalProps {
  id: number | null;
  nameModules?: string;
  nameUsers?: string;
  nameGroups?: string;
  username?: string;
  access?: string;
  description?: string;
  link?: string;
  status?: string;
  icon?: string;
  main?: string;
  userGroups?: Array<{
    ug_id: number;
    ug_group: string;
  }>;
  userModules?: Array<{
    ptmodul_id: number;
    ptmodul_name: string;
  }>;
  type: "group" | "module" | "user";
  onClose: () => void;
  onSuccess?: () => void;
}

export default function Modal({
  onClose,
  type,
  onSuccess,
  ...props
}: ModalProps) {
  console.log(props.access);
  const [formData, setFormData] = useState({
    // Module fields
    ptmodul_name: props.nameModules || "",
    ptmodul_link: props.link || "",
    ptmodul_icon: props.icon || "",
    ptmodul_main: props.main === "" ? null : props.main || null,
    // User fields
    usr_name: props.nameUsers || "",
    usr_username: props.username || "",
    usr_user_group: props.access || "",
    usr_isactive: props.status || "",
    // Group fields
    ug_group: props.nameGroups || "",
    ug_description: props.description || "",
    ug_isactive: props.status || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "ptmodul_main" ? (value === "" ? null : value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  setIsLoading(true);
  setError("");

  const payload = {
    ...formData,
    ptmodul_main: formData.ptmodul_main === "" ? null : formData.ptmodul_main,
  };

  console.log("Final payload:", payload);

    const endpoints = {
      module: `http://127.0.0.1:8000/api/updatemodule/${props.id}`,
      user: `http://127.0.0.1:8000/api/updateuser/${props.id}`,
      group: `http://127.0.0.1:8000/api/updategroup/${props.id}`,
    };

    console.log("Payload to be sent:", payload); // Debugging output

    try {
      const response = await axios.put(endpoints[type], payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        onSuccess?.();
        onClose();
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${type} name already exists`,
      });

      if (type === "user") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Username already exists`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black bg-opacity-50">
      <div className="relative px-6 py-4 w-[500px] bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-transform transform hover:scale-110"
            onClick={onClose}
          >
            ✕
          </button>

          <h3 className="font-bold text-xl text-center text-gray-800">
            {type === "module"
              ? props.nameModules
              : type === "user"
              ? props.nameUsers
              : props.nameGroups}
          </h3>

          <p className="text-sm text-gray-500 text-center mb-4">
            Fill in the details below to update the {type} information.
          </p>

          {/* Module Form */}
          {type === "module" && (
            <>
              <input
                type="text"
                name="ptmodul_name"
                placeholder="Module Name"
                value={formData.ptmodul_name}
                onChange={handleChange}
                required
                className="input input-bordered w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <input
                type="text"
                name="ptmodul_link"
                placeholder="Module Link"
                value={formData.ptmodul_link}
                onChange={handleChange}
                required
                className="input input-bordered w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <input
                type="text"
                name="ptmodul_icon"
                placeholder="Module Icon"
                value={formData.ptmodul_icon}
                onChange={handleChange}
                required
                className="input input-bordered w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <select
                name="ptmodul_main"
                id="types"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.ptmodul_main ?? ""}
                onChange={handleChange}
              >
                <option value="">Not a child of a parent</option>
                {props.userModules?.map((module) => (
                  <option key={module.ptmodul_id} value={module.ptmodul_id}>
                    {module.ptmodul_id} | {module.ptmodul_name}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* User Form */}
          {type === "user" && (
            <>
              <input
                type="text"
                name="usr_name"
                placeholder="Name"
                value={formData.usr_name}
                onChange={handleChange}
                required
                className="input input-bordered w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <input
                type="text"
                name="usr_username"
                placeholder="Username"
                value={formData.usr_username}
                onChange={handleChange}
                required
                className="input input-bordered w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <select
                name="usr_user_group"
                value={formData.usr_user_group}
                onChange={handleChange}
                required
                className="input input-bordered w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              >
                {props.userGroups?.map((group) => (
                  <option key={group.ug_id} value={group.ug_id}>
                    {group.ug_group}
                  </option>
                ))}
              </select>
              <select
                name="usr_isactive"
                value={formData.usr_isactive}
                onChange={handleChange}
                required
                className="input input-bordered w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              >
                <option value="Y">Active</option>
                <option value="N">Inactive</option>
              </select>
            </>
          )}

          {/* Group Form */}
          {type === "group" && (
            <>
              <input
                type="text"
                name="ug_group"
                placeholder="Group Name"
                value={formData.ug_group}
                onChange={handleChange}
                required
                className="input input-bordered w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <input
                type="text"
                name="ug_description"
                placeholder="Description"
                value={formData.ug_description}
                onChange={handleChange}
                required
                className="input input-bordered w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <select
                name="ug_isactive"
                value={formData.ug_isactive}
                onChange={handleChange}
                required
                className="input input-bordered w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              >
                <option value="Y">Active</option>
                <option value="N">Inactive</option>
              </select>
            </>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-lg hover:bg-gray-500"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
