import React from 'react'
import { useEffect } from 'react';


const App = () => {
  return (<>
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFFDF8] rounded-2xl shadow-md overflow-hidden border border-[#E7E2D8]">

        <div className="bg-[#7A8B72] text-white p-4 text-lg font-semibold">
          RAG Chatbot
        </div>

        <div className="h-96 p-4 overflow-y-auto space-y-3 bg-black">

          <div className="flex justify-end">
            <div className="bg-[#DDE5D8] text-[#3F493B] px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%]">
              User message
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-[#EEEAE1] text-[#4B4A43] px-4 py-2 rounded-2xl rounded-bl-sm max-w-[80%]">
              Bot message
            </div>
          </div>

        </div>

        <div className="flex gap-2 p-4 border-t border-[#E7E2D8] bg-[#FFFDF8]">
          <input
            type="text"
            className="flex-1 bg-[#F5F3EE] border border-[#DDD8CC] rounded-lg px-4 py-2 outline-none text-[#4B4A43] focus:ring-2 focus:ring-[#A7B39F]"
          />

          <button className="bg-[#7A8B72] text-white px-5 py-2 rounded-lg hover:bg-[#687960]">
            Ask
          </button>
        </div>

      </div>
    </div>
  </>)
}



export default App;
