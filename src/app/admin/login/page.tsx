"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginResponse } from "@/types/Login";

import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  // const pathname = usePathname() ?? ""; // Removed unused
  const { handleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post<LoginResponse>("/api/admin/login", {
        email,
        password,
      });

      if (data.success) {
        handleLogin();
        // navigate via App‑Router
        router.push("/");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Please try again...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-info rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-white text-center">
            Login
          </h2>
          <p className="mt-2 text-center text-gray-400">
            Access your account
          </p>

          {error && (
            <div className="bg-error text-error-content p-2 text-center mb-4 rounded-md">
              {error}
            </div>
          )}

          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="flex flex-col mb-4">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="px-3 py-2 my-2 bg-base-100 text-base-content rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="relative mb-6">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="px-3 py-2 my-2 bg-base-100 text-base-content rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[44px] text-gray-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </button>
            </div>

            <Button
              type="submit"
              className="w-full py-2 px-4 bg-accent text-white rounded-md hover:bg-success transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
