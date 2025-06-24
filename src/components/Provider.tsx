"use client"
import { ImageKitProvider } from "@imagekit/next"
import { SessionProvider } from "next-auth/react"
import Header from "./Header"
import { Session } from "next-auth";

const urlEndpoint=process.env.NEXT_PUBLIC_IMAGEKIT_URL

function Provider({children,session}:{children:React.ReactNode,session:Session|null}) {
  return (
   <SessionProvider session={session} refetchInterval={5*60}>
    <ImageKitProvider urlEndpoint={urlEndpoint}>
       <Header />
  <main className=" pt-16 min-h-[calc(100vh-64px)]">
    {children}
  </main>
    </ImageKitProvider>
   </SessionProvider>
  )
}

export default Provider