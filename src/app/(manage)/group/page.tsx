"use client";
import Bread from "@/components/Bread";
import SearchInput from "@/components/SearchInput";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { useState } from "react";
import Swal from "sweetalert2";
import { DataTable } from "./data-table";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";

interface UserGroup {
  ug_id: number;
  ug_group: string;
  ug_description: string;
  ug_isactive: string;
}

// Separate the fetch function for better reusability
const fetchUserGroups = async (): Promise<UserGroup[]> => {
  const response = await axios.get("http://127.0.0.1:8000/api/checkgroup");
  return response.data.data.group;
};

export default function Group() {
  const {
    data: userGroups = [],
    isLoading,
    refetch,
  } = useQuery<UserGroup[]>({
    queryKey: ["userGroups"],
    queryFn: fetchUserGroups,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    ug_group: "",
    ug_description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredData = userGroups.filter((group) => {
    if (!group || !group.ug_group) return false;
    return group.ug_group.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/creategroup",
        formData
      );
      console.log("Data berhasil dikirim", response.data);
      Swal.fire({
        title: "Good job!",
        text: "Group added successfully ",
        icon: "success"
      });
      refetch();
      setFormData({
        ug_group: "",
        ug_description: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Group name already exists",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    Swal.fire({
      title: "Good job!",
      text: "Successfully edit data",
      icon: "success",
    });
    refetch();
  };

  const [modalEdit, setModalEdit] = useState({
    open: false,
    id: 0,
    nameGroups: "",
    description: "",
    status: "",
  });
  const handleEdit = (
    idGroup: number,
    nameGroup: string,
    descriptionGroup: string,
    statusGroup: string
  ) => {
    // console.log(idGroup, nameGroup, descriptionGroup, statusGroup);
    setModalEdit({
      open: true,
      id: idGroup,
      nameGroups: nameGroup,
      description: descriptionGroup,
      status: statusGroup,
    });
  };
  const handleCloseModal = () => {
    setModalEdit({
      open: false,
      id: 0,
      nameGroups: "",
      description: "",
      status: "",
    });
  };
  const handleDelete = (group: number) => {
    console.log("id", group);
    axios
      .get(`http://127.0.0.1:8000/api/checkgroup`)
      .then((statusResponse) => {
        if (
          !statusResponse.data?.data?.group ||
          !Array.isArray(statusResponse.data.data.group)
        ) {
          Swal.fire("Error!", "Invalid response format", "error");
          return;
        }

        const groupData = statusResponse.data.data.group.find(
          (g: any) => g.ug_id === group
        );

        if (!groupData) {
          Swal.fire("Error!", "Group not found.", "error");
          return;
        }

        if (groupData.ug_isactive === "N") {
          Swal.fire(
            "Group Inactive",
            "This group has already been deactivated.",
            "info"
          );
          return;
        }

        Swal.fire({
          title: "Are you sure you want to inactive this group?",
          text: "You can change it back in the edit feature",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, inactive it!",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            axios
              .delete(`http://127.0.0.1:8000/api/deletegroup/${group}`)
              .then((response) => {
                if (response.data?.success) {
                  refetch();
                  Swal.fire(
                    "Deactivated!",
                    "The group has been deactivated.",
                    "success"
                  );
                } else {
                  throw new Error("Operation failed");
                }
              })
              .catch((error) => {
                console.error("Delete error:", error);
                Swal.fire("Error!", "Failed to deactivate the group.", "error");
              });
          }
        });
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        Swal.fire("Error!", "Failed to fetch group status.", "error");
      });
  };

  return (
    <>
      {modalEdit.open && (
        <Modal
          type="group"
          id={modalEdit.id}
          nameGroups={modalEdit.nameGroups}
          description={modalEdit.description}
          status={modalEdit.status}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
      <h1 className="text-[3em] font-[600]">User Groups</h1>
      <Bread>User Groups</Bread>
      <br />
      <p className="text-gray-700">Modul untuk manajemen user group SIM RPL</p>
      <SearchInput value={searchTerm} onChange={handleSearch}>
        Cari nama grup...
      </SearchInput>
      <div className="flex lg:flex-row flex-col gap-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg lg:w-[65%] h-fit mt-8">
          <DataTable
            data={filteredData}
            isLoading={isLoading}
            columns={columns}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
          <p className="m-2 text-gray-600">* Note: Click to edit grup </p>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg lg:w-[35%] mt-8 p-5">
          <p className="mb-5 text-[1.5em] font-bold">Add New User Group</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Name Group
              </label>
              <input
                type="text"
                id="text"
                name="ug_group"
                value={formData.ug_group}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="input name group"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Group Description
              </label>
              <textarea
                name="ug_description"
                id="description"
                value={formData.ug_description}
                onChange={handleInputChange}
                cols={5}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Input usergroup description"
              ></textarea>
            </div>
            <div className="mb-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {loading ? "Saving..." : "Save Group"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
