import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });



// export const POST=async(req:NextRequest)=>{
//     const {prompt}=await req.json()
//    try {
//    const response = await openai.chat.completions.create({
//       messages: [{ role: "user", content: prompt }],
//       model: "gpt-3.5-turbo",
//     });
//     console.log(response);

//     return NextResponse.json({ reply:  response.choices[0].message.content});
//   } catch (error:unknown) {
//     console.error(error instanceof Error ? error.message : "Unknown error");
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }

// }



export const POST=async(req:NextRequest)=>{
    const {prompt}=await req.json()
   try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
       
      });
    // const result = await model.generateContent(prompt);
  const chat = model.startChat({

   systemInstruction: {
    role: "system", 
    parts: [
      {
        text:
          "Your name is Salim Khan. You are a helpful assistant that generates engaging video titles and descriptions based on the prompt provided. Keep the tone creative and concise.",
      },
    ],
  },

   history: [
    {
      role: "user",
      parts: [{ text: "Hello" }],
    },
    {
      role: "model",
      parts: [{ text: "Hi! I'm Salim Khan. How can I help you today?" }],
    },
  ],
});
const result = await chat.sendMessage(prompt);
    const response = await result.response;

    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error:unknown) {
    console.error(error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }

}