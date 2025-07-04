"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Signup() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const submitHandler = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.error("Email or password is missing");
        return;
      }

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Registration failed");
        throw new Error(data.error || "Registration failed");
      }

      toast.success("Registration successful");
      router.push("/login");

    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [status, session, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Signup to Your Account</h2>

        <form className="space-y-4" onSubmit={submitHandler}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password with Toggle */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

       
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-400">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-sm text-indigo-400 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition duration-200"
          >
            Signup
          </button>
        </form>

        {/* Google Signup */}
        <button
          onClick={() => signIn('google')}
          className="mt-6 w-full cursor-pointer flex items-center justify-center gap-3 bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition"
        >
          <FcGoogle size={20} />
          Sign in with Google
        </button>

        {/* Already have an account? */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
