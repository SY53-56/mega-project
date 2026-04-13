import React, { useCallback, useEffect, useState } from 'react'
import GenerateBlog from '../component/GenerateBlog'
import { useDispatch, useSelector } from 'react-redux'
import { generateAiBlogThunk, getAiBlogPostThunk } from '../features/aiBlogThunk'
import { toast } from 'react-toastify'
import Button from "../component/Button"
import { useParams } from 'react-router-dom'

export default function GenerateAiBlogPage() {
  const { aiblog, status,aiblogs } = useSelector(state => state.aiblog)
  const user = useSelector(state => state.auth.user)
  const {id}= useParams()

  const [blog, setBlog] = useState("")
  const dispatch = useDispatch()

 useEffect(()=>{
 if (id) {
    dispatch(getAiBlogPostThunk(id));
  }

 },[dispatch , id])
const handleCopy = () => {
  if (aiblog?.blogDescription) {
    navigator.clipboard.writeText(aiblog.blogDescription);
  toast.success("copy blog")
  }
};

  const handleGenerateBlog = useCallback(async () => {
    if (!blog.trim()) {
      toast.error("Please enter a blog topic")
      return
    }

    if (user) {
      await dispatch(generateAiBlogThunk(blog))
      setBlog("")
      toast.success("generate")
    } else {
      toast.error("Please login first")
    }
  }, [dispatch, user, blog])

  return (
    <main className="w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mt-16 text-center mb-8">
        Generate Your Blog ✨
      </h1>

      {/* Blog Output */}
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 min-h-[300px] mb-6">

        {status ==="loading"? (
          <p className="text-gray-300 text-center">Generating blog...</p>
        ) :    aiblog.blogDescription? (
          <div className="text-white flex flex-col items-center justify-center whitespace-pre-wrap">
           <p> {aiblog.blogDescription}</p>
           <Button onClick={handleCopy} className='bg-blue-500 mt-3 ' name="copy blog"/>
          </div>
        ) : (
          <p className="text-gray-400 text-center">
            Your generated blog will appear here...
          </p>
        )}
        
      </div>

      {/* Input Component */}
      <GenerateBlog
        blog={blog}
        setBlog={setBlog}
        handleGenerateBlog={handleGenerateBlog}
      />

    </main>
  )
}