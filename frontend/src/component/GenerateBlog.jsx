import { SearchIcon } from 'lucide-react'
import React from 'react'

export default function GenerateBlog() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-2xl px-6">
        
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
          Generate Your Blog ✨
        </h1>

        {/* Input Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-3 flex items-center gap-3">
          
          <input
            type="text"
            placeholder="Type a blog idea..."
            className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none px-3 py-2"
          />

          <button className="bg-amber-500 hover:bg-amber-600 transition-all p-3 rounded-xl shadow-md">
            <SearchIcon className="text-white w-5 h-5" />
          </button>
        </div>

        {/* Helper text */}
        <p className="text-gray-400 text-sm text-center mt-4">
          Enter a topic and let AI create a blog for you
        </p>
      </div>
    </main>
  )
}
