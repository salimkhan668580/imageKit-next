"use client"

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁 Toggle state

  const submitHandler = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        toast.error("Email or password is missing");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      } else {
        toast.success("Login successful");
        router.push("/");
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        toast.error(error.message);
      } else {
        console.error("Unknown error:", error);
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Login to Your Account</h2>

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

          {/* Password with Eye Icon */}
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
              className="absolute cursor-pointer right-3 top-9 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-400">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-sm text-indigo-400 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 cursor-pointer text-white py-2 rounded-lg hover:bg-indigo-500 transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Google Sign-in */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="mt-6 w-full cursor-pointer flex items-center justify-center gap-3 bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition"
        >
          <FcGoogle size={20} />
          Sign in with Google
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
