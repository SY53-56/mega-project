import { SearchIcon } from 'lucide-react'
import React from 'react'

export default function GenerateBlog({blog, setBlog, handleGenerateBlog}) {
  console.log( blog)
  return (
   
      <div className="w-full max-w-2xl px-6">
        
        {/* Heading */}
      

        {/* Input Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-3 flex items-center gap-3">
          
          <input
            type="text"
            value={blog}
            name='blog'
            onChange={(e)=>setBlog(e.target.value)}
            required
            placeholder="Type a blog idea..."
            className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none px-3 py-2"
          />

          <button onClick={handleGenerateBlog}  className="bg-amber-500 hover:bg-amber-600 transition-all p-3 rounded-xl shadow-md">
            <SearchIcon className="text-white w-5 h-5" />
          </button>
        </div>

        {/* Helper text */}
        <p className="text-gray-400 text-sm text-center mt-4">
          Enter a topic and let AI create a blog for you
        </p>
      </div>

  )
}
