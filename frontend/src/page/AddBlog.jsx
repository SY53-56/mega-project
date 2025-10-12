import React from 'react'
import Button from '../component/Button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

export default function AddBlog() {
   const [form , setForm]= useState({
    
   })
const navigate = useNavigate()
const {token}= useSelector(state=>state.auth)
const dispitch= useDispatch()

  return (
    <div className='w-full h-[100vh] bg-blue-950 text-white  flex justify-center items-center'>
      <div className='w-[400px] h-auto border px-5 py-3 rounded shadow-2xl'>
        <h1 className='text-5xl font-bold text-center mb-3'>add Blog</h1>
        <form action="" className='flex flex-col'>
          <label htmlFor="text" className='mb-1'>title</label>
          <input className='px-3 py-0.5 rounded border outline-none mb-3' type="text" id='text' name="title" placeholder='title' />
            <label className='mb-1' htmlFor="img">Image</label>
          <input className='px-3 py-0.5 border text-white  rounded outline-none mb-3' type="url" id='img' name="img" placeholder='http/www/photo/img.com' />
          <label className='mb-1' htmlFor="description">description</label>
          <textarea name="description" className='outline-none px-3 py-1 border rounded' id="description" cols={5} rows={5} placeholder='text your decription'></textarea>
          <Button  className="bg-orange-600 mt-4 text-white " name="Add Blog"/>
        </form>
      </div>
    </div>
  )
}
