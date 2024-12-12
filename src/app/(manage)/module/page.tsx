"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Bread from "@/components/Bread";
import SearchInput from "@/components/SearchInput";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Module {
  ptmodul_id: number;
  ptmodul_name: string;
  ptmodul_link: string;
  ptmodul_icon: string;
  ptmodul_main: any;
}

const fetchUserGroups = async (): Promise<Module[]> => {
  const response = await axios.get("http://127.0.0.1:8000/api/checkmodule");
  return response.data.data.module;
};

export default function Module() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    ptmodul_name: "",
    ptmodul_link: "",
    ptmodul_icon: "",
    ptmodul_main: "",
  });
  const [selectedValue, setSelectedValue] = useState("");
  const {
    data: userModules = [],
    isLoading,
    refetch,
  } = useQuery<Module[]>({
    queryKey: ["userGroups"],
    queryFn: fetchUserGroups,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
        "http://127.0.0.1:8000/api/createmodule",
        formData
      );
      console.log("Data berhasil dikirim", response.data);
      Swal.fire({
        title: "Good job!",
        text: "Group added successfully ",
        icon: "success",
      });
      refetch();
      setFormData({
        ptmodul_name: "",
        ptmodul_link: "",
        ptmodul_icon: "",
        ptmodul_main: "",
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

  const filteredData = userModules.filter((module) => {
    if (!module || !module.ptmodul_name) return false;
    return module.ptmodul_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const [modalEdit, setModalEdit] = useState({
    open: false,
    id: 0,
    nameModules: "",
    link: "",
    icon: "",
    main: "",
  });
  const handleEdit = (
    idModule: number,
    nameModule: string,
    linkModule: string,
    iconModule: string,
    mainModule: string
  ) => {
    // console.log(idGroup, nameGroup, descriptionGroup, statusGroup);
    setModalEdit({
      open: true,
      id: idModule,
      nameModules: nameModule,
      link: linkModule,
      icon: iconModule,
      main: mainModule,
    });
  };
  const handleCloseModal = () => {
    setModalEdit({
      open: false,
      id: 0,
      nameModules: "",
      link: "",
      icon: "",
      main: "",
    });
  };

  const handleSuccess = () => {
    Swal.fire({
      title: "Good job!",
      text: "Successfully edit data",
      icon: "success",
    });
    refetch();
  };

  const handleDelete = (module: number) => {
    console.log("id", module);
    Swal.fire({
      title: "Are you sure you want to delete this module?",
      text: "You can't change it once it's deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://127.0.0.1:8000/api/deletemodule/${module}`)
          .then((response) => {
            if (response.data?.success) {
              refetch();
              Swal.fire(
                "Deactivated!",
                "The module has been delete.",
                "success"
              );
            } else {
              throw new Error("Operation failed");
            }
          })
          .catch((error) => {
            console.error("Delete error:", error);
            Swal.fire("Error!", "Failed to delete the module.", "error");
          });
      }
    });
  };

  return (
    <>
      {modalEdit.open && (
        <Modal
          type="module"
          id={modalEdit.id}
          nameModules={modalEdit.nameModules}
          link={modalEdit.link}
          icon={modalEdit.icon}
          main={modalEdit.main}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          userModules={userModules}
        />
      )}
      <h1 className="text-[3em] font-[600]">Module</h1>
      <Bread>Module</Bread>
      <br />
      <p className="text-gray-700">
        Modul untuk mengatur menu yang akan tampil pada pengguna
      </p>
      <SearchInput value={searchTerm} onChange={handleSearch}>
        Cari nama modul...
      </SearchInput>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg lg:w-[65%] w-full h-fit mt-8">
          <DataTable
            data={filteredData}
            isLoading={isLoading}
            columns={columns}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
          <p className="m-2 text-gray-600">* Note: Click to edit module </p>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg lg:w-[35%] w-full mt-8 p-5">
          <p className="mb-5 text-[1.5em] font-bold">Add New Module</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Module Name
              </label>
              <input
                type="text"
                id="text"
                name="ptmodul_name"
                value={formData.ptmodul_name}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter Module Name"
                required
              />
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Module URL
                </label>
                <input
                  type="text"
                  id="link"
                  name="ptmodul_link"
                  value={formData.ptmodul_link}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="/url-name"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Module Icon
                </label>
                <input
                  type="text"
                  id="icon"
                  name="ptmodul_icon"
                  value={formData.ptmodul_icon}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Use Fontawesome"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <select
                name="ptmodul_main"
                id="types"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={formData.ptmodul_main}
                onChange={handleInputChange}
              >
                <option value="" hidden aria-readonly>
                  Choose the type
                </option>
                {userModules.map((module, index) => (
                  <option key={index} value={module.ptmodul_id}>
                    {module.ptmodul_id} | {module.ptmodul_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {loading ? "Saving..." : "Save Module"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
