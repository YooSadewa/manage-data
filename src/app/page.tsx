"use client";
import { Carousel } from "flowbite-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen dark:bg-gray-900 p-8">
      {/* Carousel Section */}
      <div id="default-carousel" className="relative w-full mb-8">
        {loading ? (
          <div className="h-56 md:h-[515px] skeleton bg-gray-300 rounded-lg"></div>
        ) : (
          <Carousel>
            <div className="relative h-56 overflow-hidden rounded-lg md:h-[515px]">
              <img
                src="/carousel/Webslider.webp"
                className="absolute block w-full h-full object-cover"
                alt="Slide 1"
              />
              <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
                <h3 className="text-xl font-semibold">
                  Welcome to Our Platform
                </h3>
                <p>Your one-stop solution</p>
              </div>
            </div>
            <div className="relative h-56 overflow-hidden rounded-lg md:h-[515px]">
              <img
                src="/carousel/image.png"
                className="absolute block w-full h-full object-cover"
                alt="Slide 2"
              />
              <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
                <h3 className="text-xl font-semibold">Explore Features</h3>
                <p>Efficient and customizable tools</p>
              </div>
            </div>
            <div className="relative h-56 overflow-hidden rounded-lg md:h-[515px]">
              <img
                src="carousel/image2.png"
                className="absolute block w-full h-full object-cover"
                alt="Slide 3"
              />
              <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
                <h3 className="text-xl font-semibold">Join Us Today</h3>
                <p>Start your journey with us</p>
              </div>
            </div>
          </Carousel>
        )}
      </div>

      {/* Dashboard Header */}
      {loading ? (
        <div>
          <div className="w-1/3 h-10 bg-gray-300 skeleton rounded my-4"></div>
          <div className="w-1/2 h-6 bg-gray-300 skeleton rounded mb-4"></div>
          <div className="w-2/3 h-6 bg-gray-300 skeleton rounded mb-4"></div>
        </div>
      ) : (
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
            Seluruh data untuk pengaturan aplikasi
          </p>
          <p className="mt-2">
            {session ? (
              <>
                Nama Admin:{" "}
                <span className="text-red-700">{session?.user?.name}</span>
              </>
            ) : (
              <span>Undifined</span>
            )}
          </p>
        </div>
      )}

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-5 h-44 rounded bg-gray-300 skeleton"
            ></div>
          ))
        ) : (
          <>
            <div className="flex items-center justify-center h-44 rounded bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:shadow-xl transition">
              <Link href={"/module"} className="text-2xl text-white group">
                <span className="font-semibold group-hover:underline">
                  Module
                </span>
              </Link>
            </div>
            <div className="flex items-center justify-center h-44 rounded bg-gradient-to-r from-green-500 to-teal-500 shadow-lg hover:shadow-xl transition">
              <Link href={"/users"} className="text-2xl text-white group">
                <span className="font-semibold group-hover:underline">
                  Users
                </span>
              </Link>
            </div>
            <div className="flex items-center justify-center h-44 rounded bg-gradient-to-r from-red-500 to-pink-500 shadow-lg hover:shadow-xl transition">
              <Link href={"/group"} className="text-2xl text-white group">
                <span className="font-semibold group-hover:underline">
                  Group
                </span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
