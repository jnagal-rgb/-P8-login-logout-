"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { apiClient } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { isChecking } = useAuthGuard({ requireAuth: false });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isChecking) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiClient("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      router.push(CONFIG.ROUTES.LOGIN);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center px-4 py-10 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/uni.jpg')",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">

        {/* Register Header */}
        <div className="text-center mb-7 text-white">

          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-white/15 border border-white/30 backdrop-blur-md">
              <UserPlus size={32} />
            </div>
          </div>

          <h1 className="text-5xl font-bold tracking-wide">
            Welcome!
          </h1>

          <p className="mt-3 text-base text-white/90">
            Create your account and get started.
          </p>

          <div className="w-20 h-1 bg-blue-400 rounded-full mx-auto mt-5" />
        </div>

        {/* Glass Register Box */}
        <div className="w-full rounded-2xl border border-white/40 bg-white/20 backdrop-blur-2xl shadow-2xl overflow-hidden">

          <form onSubmit={handleRegister} className="p-6 space-y-5">

            {/* Register Heading */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">
                Create Account
              </h2>

              <p className="text-sm text-gray-800">
                Register a new account to get started.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-900">
                Username
              </Label>

              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12 bg-white/85 text-gray-900 border-white/50 placeholder:text-gray-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-white/85 text-gray-900 border-white/50 placeholder:text-gray-500"
              />
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <Button
              type="button"
              className="w-full h-12 bg-red-700 hover:bg-red-800 text-white font-semibold"
            >
              Login with Google
            </Button>

            {/* Login Link */}
            <p className="text-sm text-center text-gray-900 pt-2">
              Already have an account?{" "}
              <Link
                href={CONFIG.ROUTES.LOGIN}
                className="text-blue-700 font-semibold underline"
              >
                Login
              </Link>
            </p>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/90 mt-6">
          Secure Registration System
        </p>

      </div>
    </main>
  );
}
