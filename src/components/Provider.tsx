"use client"
import { ImageKitProvider } from "@imagekit/next"
import { SessionProvider } from "next-auth/react"
import Header from "./Header"

const urlEndpoint=process.env.NEXT_PUBLIC_IMAGEKIT_URL

function Provider({children,session}:{children:React.ReactNode,session:any}) {
  return (
   <SessionProvider session={session} refetchInterval={5*60}>
    <ImageKitProvider urlEndpoint={urlEndpoint}>
       <Header />
  <main className="pt-16">
    {children}
  </main>
    </ImageKitProvider>
   </SessionProvider>
  )
}

export default Provider