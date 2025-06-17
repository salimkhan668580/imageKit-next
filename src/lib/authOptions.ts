import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./dbConnect";
import User from "@/models/User";

export const authOption:NextAuthOptions={
    providers: [
  CredentialsProvider({
    name: "Credentials",

    credentials: {
      email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
        if(!credentials?.email || !credentials?.password){
           throw new Error("email or password is missing")
      
        }
        try {
              await dbConnect();
        const user=await User.findOne({email:credentials.email})
        if(!user){
            throw new Error("user not found")
        }

        return {
            id:user._id.toString(),
            email:user.email
        }
            
        } catch (error) {
            console.error("Login  error:", error);
            throw new Error("something went wrong")
        }
    }
  })
],
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
    }
    return token;
  },
  async session({ session, token }) {
    if (token) {
      session.user.id = token.id as string;
    }
    return session;
  }
},

pages:{
    signIn:"/login",
    error:"/login"
},
session:{
    strategy:"jwt",
    maxAge:30*24*60*60
},

secret:process.env.NEXTAUTH_SECRET

}