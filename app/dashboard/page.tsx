"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { clearTokens } from "@/lib/auth";
import { CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const statistics = [
  { title: "Total Users", value: "1,248" },
  { title: "Online Users", value: "1,200" },
  { title: "Offline Users", value: "48" },
  { title: "Active Users", value: "1,115" },
];

const orders = [
  {
    id: "#USR-1001",
    customer: "Juan Gomez",
    product: "Cellphone",
    status: "Online",
    date: "Jgomez@gmail.com",
  },
  {
    id: "#USR-1002",
    customer: "Maria Magdangal",
    product: "Tablet",
    status: "Offline",
    date: "Mmagdangal@gmail.com",
  },
  {
    id: "#USR-1003",
    customer: "Carlos Logo",
    product: "Cellphone",
    status: "Online",
    date: "Clogo@gmail.com",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { isChecking } = useAuthGuard({ requireAuth: true });

  const [darkMode, setDarkMode] = useState(false);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Verifying session...
        </p>
      </div>
    );
  }

  const handleLogout = () => {
    clearTokens();
    router.push(CONFIG.ROUTES.LOGIN);
  };

  return (
    <main
      className={`min-h-screen p-6 md:p-10 transition-colors duration-300 ${
        darkMode
          ? "bg-gray-950 text-white"
          : "bg-slate-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-wrap justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-5">
          <div>
            <h1 className="text-3xl font-bold">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Hello!
            </p>
          </div>

          <div className="flex gap-2">
            <Button
  variant="outline"
  onClick={() => setDarkMode(!darkMode)}
  className="inline-flex items-center gap-2 bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
>
  {darkMode ? (
    <>
      <Sun size={18} />
      Light Mode
    </>
  ) : (
    <>
      <Moon size={18} />
      Dark Mode
    </>
  )}
</Button>

            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </header>

        <Card className={`transition-colors duration-300 ${
    darkMode
      ? "bg-gray-900 border-gray-700 text-white"
      : "bg-white border-gray-200 text-gray-900"
  }`}
>
          <CardHeader>
            <CardTitle>
              Maligayang pag babalik Master!
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground">
              You are authenticated. Your active JNT session is stored in LocalStorage.
            </p>
          </CardContent>
        </Card>

        {/* Statistics */}

{/* Statistics */}
<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {statistics.map((item) => (
    <div
      key={item.title}
      className={`rounded-xl border p-6 shadow-sm transition-colors flex flex-col items-center justify-center text-center ${
        darkMode
          ? "bg-gray-900 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {item.title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {Number(item.value.replace(",", "")).toLocaleString()}
      </h2>

      {/* Active Users Progress Bar */}
      {item.title === "Active Users" && (
        <div className="mt-4 w-full">
          <div
            className={`h-2 w-full rounded-full overflow-hidden ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${
                  (Number(item.value.replace(",", "")) / 1248) * 100
                }%`,
              }}
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {(
              (Number(item.value.replace(",", "")) / 1248) * 100
            ).toFixed(1)}% of total users
          </p>
        </div>
      )}
    </div>
  ))}
</section>

        {/* Recent Orders */}
        <section
          className={`rounded-xl border shadow-sm p-5 ${
            darkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold">
              Users Tracker
            </h2>

            <button className="text-sm text-blue-600 hover:underline">
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr
                  className={
                    darkMode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-slate-100 text-gray-700"
                  }
                >
                  <th className="p-3">Users ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Device</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Gmail</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b ${
                      darkMode
                        ? "border-gray-700"
                        : "border-gray-100"
                    }`}
                  >
                    <td className="p-3 font-medium">
                      {user.id}
                    </td>

                    <td className="p-3">
                      {user.customer}
                    </td>

                    <td className="p-3">
                      {user.product}
                    </td>

                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium ${
                          user.status === "Online"
                            ? "bg-green-500 text-black dark:bg-green-500 dark:text-white"
                            : user.status === "Offline"
                            ? "bg-red-500 text-black dark:bg-red-500 dark:text-white"
                            : "bg-red-500 text-black dark:bg-red-500 dark:text-white"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {user.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}