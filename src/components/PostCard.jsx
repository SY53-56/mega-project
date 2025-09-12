import React from 'react'
import service from '../appwrite/config'
import { Link } from 'react-router-dom'
export default function PostCard({$id , title, featuredImage}) {
  return (
   <Link to={`/post/${$id}`}>
    <div className='w-full bg-=gray-100 rounded-xly p4'>
        <div className='w-full flex justify-center mb-4'>
        <img className='rounded-xl' src={service.getFilePreview(featuredImage)} al={title} />
        </div>
        <h2 className='text-xl font-bold'>{title}</h2>
    </div>
   </Link>
  )
}
