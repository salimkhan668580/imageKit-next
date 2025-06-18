"use client"

import { log } from "console";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";


function Login() {
  const router=useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submitHandler=async(e:React.FormEvent<HTMLElement>)=>{
   console.log(email,password)
    e.preventDefault();
    try {
      const result=await signIn("credentials",{
        email,
        password,
        redirect:false
      })

      if(result?.error){
        throw new Error(result.error)
      }else{

        toast.success("login successfull")
        router.push("/")
      }
    } catch (error:any) {
      console.error("Login error:", error);
      toast.error(error.message)
    }



  }
  return (
       <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
        <form className="space-y-4" onSubmit={(e)=>submitHandler(e)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
           
            className="w-full cursor-pointer bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login