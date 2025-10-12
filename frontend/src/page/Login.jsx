import React, { useState } from 'react'
import Button from '../component/Button'
import { useDispatch } from 'react-redux'
import { fetchLogin } from '../features/authSlice'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [form ,setForm]=useState({
        email:"",
        password:""
    })
    const navigate = useNavigate()
    const dispitch= useDispatch()
    function handleForm(e){
        const {name ,value} = e.target
        setForm(prev=>({...prev,[name]:value}))
    }
    function formHandler(e){
       e.preventDefault()
        dispitch(fetchLogin(form))
        navigate("/")
    }
  return (
      <div className='w-full h-[100vh] flex justify-center items-center'>
        <div className='w-[400px] h-auto px-4 py-6 shadow-2xl'>
            <h1 className='text-center text-5xl font-bold'>login From</h1>
            <form onSubmit={formHandler} action="" className='flex flex-col  p-4 '>
                 <label htmlFor="email" className='mt-3 mb-1'>email</label>
                 <input className='outline-none mb-2  border px-2 py-0.5 rounded' value={form.email} onChange={handleForm} type="email" id='email' placeholder='Enter yuour email' name='email'  />
           
                 <label htmlFor="email" className='mt-3 mb-1'>password</label>
                 <input className='outline-none mb-3 border px-2 py-0.5 rounded' value={form.password} onChange={handleForm} type="password" id='password' placeholder='Enter yuour password' name='password'  />
                 <Button type='submit' className='bg-amber-500 text-white mt-5' name="Login"/>
            </form>
        </div>

      </div>
  )
}
