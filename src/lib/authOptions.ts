import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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
      const { email, password } = credentials || {};
         if (!email || !password) {
          throw new Error("email or password is missing");
        }
        try {
              await dbConnect();
        const user=await User.findOne({email})
        if(!user){
            throw new Error("user not found")
        } 

        return {
            id:user._id.toString(),
            email:user.email
        }
            
        }catch (error: unknown) {
  console.error("Login error:", error);

  if (error instanceof Error) {
    throw new Error(error.message); // rethrow with original message
  } else {
    throw new Error("An unexpected error occurred");
  }
}
    }
  }),

     GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
],
callbacks: {

  async signIn({ user, account }) {
    console.log("signIn:", user, account);
    if (account?.provider === "google") {
      await dbConnect();
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        const newUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          provider: "google",
          id:user.id,
          accessToken:account.access_token
          
        });
        
        console.log("✅ New user stored from Google:", newUser);
      } else {
        console.log("🟡 User already exists:", existingUser.email);
      }
    }
    return true; 
  },

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