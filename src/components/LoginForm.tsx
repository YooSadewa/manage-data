import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function LoginForm() {
  const { replace } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "username_not_verified"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        usr_username: formData.get("usr_username"),
        usr_password: formData.get("usr_password"),
      });

      if (!res?.error) {
        setStatus("success");
        Swal.fire({
          title: "Good job!",
          text: "You successfully logged in!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          replace("/");
        });
      } else if (res?.status === 401) {
        setStatus("error");
      } else if (res?.status === 403) {
        setStatus("username_not_verified");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="usr_username" className="sr-only">
                Email address
              </label>
              <input
                id="usr_username"
                name="usr_username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="usr_password" className="sr-only">
                Password
              </label>
              <input
                id="usr_password"
                name="usr_password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading ? "Loading..." : "Sign in"}
            </button>
          </div>

          {status === "error" && (
            <p className="text-red-500 text-sm text-center">
              Invalid credentials
            </p>
          )}
          {status === "username_not_verified" && (
            <p className="text-yellow-500 text-sm text-center">
              Please verify your email
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
