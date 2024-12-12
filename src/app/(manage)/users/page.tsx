"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Bread from "@/components/Bread";
import SearchInput from "@/components/SearchInput";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Modal from "@/components/Modal";
import Swal from "sweetalert2";

interface UserGroup {
  ug_id: number;
  ug_group: string;
  ug_description: string;
  ug_isactive: string;
}

interface Users {
  usr_id: number;
  usr_user_group: number;
  usr_name: string;
  usr_username: string;
  usr_isactive: string;
  user_group: UserGroup;
}

const fetchUser = async (): Promise<Users[]> => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/checkuser");
    console.log(response);
    if (response.status === 200) {
      return response.data.data.user;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

const fetchUserGroups = async (): Promise<UserGroup[]> => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/checkgroup");
    if (response.status === 200) {
      return response.data.data.group;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export default function Module() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    usr_username: "",
    usr_name: "",
    usr_isactive: "",
    usr_user_group: "",
    usr_password: "",
  });

  const {
    data: userUsers,
    isLoading,
    refetch,
  } = useQuery<Users[]>({
    queryKey: ["userUsers"],
    queryFn: fetchUser,
    placeholderData: [],
  });

  const {
    data: userGroups,
    isLoading: isLoadingGroups,
    error: userGroupsError,
  } = useQuery<UserGroup[]>({
    queryKey: ["userGroups"],
    queryFn: fetchUserGroups,
    placeholderData: [],
  });

  const filteredData =
    userUsers?.filter((user) => {
      if (!user || !user.usr_name) return false;
      return user.usr_name.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register",
        formData
      );
      Swal.fire({
        title: "Good job!",
        text: "Group added successfully ",
        icon: "success",
      });
      refetch();
      setFormData({
        usr_username: "",
        usr_name: "",
        usr_isactive: "",
        usr_user_group: "",
        usr_password: "",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Username already exists",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
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

  const [modalEdit, setModalEdit] = useState({
    open: false,
    id: 0,
    nameUsers: "",
    username: "",
    access: "",
    status: "",
  });

  const handleEdit = (
    idUser: number,
    nameUser: string,
    usernameUser: string,
    access: string,
    statusUser: string
  ) => {
    setModalEdit({
      open: true,
      id: idUser,
      nameUsers: nameUser,
      username: usernameUser,
      access: access,
      status: statusUser,
    });
  };

  const handleCloseModal = () => {
    setModalEdit({
      open: false,
      id: 0,
      nameUsers: "",
      username: "",
      access: "",
      status: "",
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

  const handleDelete = (user: any) => {
    console.log("id", user);
    Swal.fire({
      title: "Are you sure you want to delete this user?",
      text: "You can't change it once it's deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://127.0.0.1:8000/api/deleteuser/${user}`)
          .then((response) => {
            if (response.data?.success) {
              refetch();
              Swal.fire(
                "Deactivated!",
                "The user has been delete.",
                "success"
              );
            } else {
              throw new Error("Operation failed");
            }
          })
          .catch((error) => {
            console.error("Delete error:", error);
            Swal.fire("Error!", "Failed to delete the user.", "error");
          });
      }
    });
  };

  return (
    <>
      {modalEdit.open && (
        <Modal
          type="user"
          id={modalEdit.id}
          nameUsers={modalEdit.nameUsers}
          username={modalEdit.username}
          access={modalEdit.access}
          status={modalEdit.status}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          userGroups={userGroups}
          
        />
      )}
      <h1 className="text-[3em] font-[600]">Users</h1>
      <Bread>Users</Bread>
      <br />
      <p className="text-gray-700">Modul untuk mengatur pengguna</p>
      <SearchInput value={searchTerm} onChange={handleSearch}>
        Cari nama user....
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
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg lg:w-[35%] mt-8 p-5">
          <p className="mb-5 text-[1.5em] font-bold">Add New User</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Username
              </label>
              <input
                type="text"
                name="usr_username"
                value={formData.usr_username}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="input your awesome username"
                required
              />
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  name="usr_name"
                  value={formData.usr_name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="input your cool name"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  User Group
                </label>
                <select
                  name="usr_user_group"
                  value={formData.usr_user_group}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                >
                  <option value="" hidden>
                    Select group...
                  </option>
                  {isLoadingGroups ? (
                    <option disabled>Loading groups...</option>
                  ) : userGroupsError ? (
                    <option disabled>Error loading groups</option>
                  ) : (
                    userGroups?.map((group, index) => (
                      <option key={group.ug_id || index} value={group.ug_id}>
                        {group.ug_group}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                name="usr_password"
                value={formData.usr_password}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="your awesome password"
                required
              />
            </div>
            <div className="mb-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {loading ? "Saving..." : "Save User"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
