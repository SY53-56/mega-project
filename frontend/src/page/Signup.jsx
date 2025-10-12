import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchSignup } from '../features/authSlice'
import Button from '../component/Button'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })
const navigate= useNavigate()
  const dispatch = useDispatch()

  function handleForm(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function formHandler(e) {
    e.preventDefault()
    dispatch(fetchSignup(form))
    navigate("/")
  }

  return (
    <div className='w-full h-[100vh] flex justify-center items-center'>
      <div className='w-[400px] h-auto px-4 py-6 shadow-2xl'>
        <h1 className='text-center text-5xl font-bold'>Signup Form</h1>
        <form onSubmit={formHandler} className='flex flex-col p-4'>
          <label htmlFor='username' className='mt-3 mb-1'>Username</label>
          <input
            className='outline-none mb-2 border px-2 py-0.5 rounded'
            value={form.username}
            onChange={handleForm}
            type='text'
            id='username'
            placeholder='Enter your username'
            name='username'
          />

          <label htmlFor='email' className='mt-3 mb-1'>Email</label>
          <input
            className='outline-none mb-2 border px-2 py-0.5 rounded'
            value={form.email}
            onChange={handleForm}
            type='email'
            id='email'
            placeholder='Enter your email'
            name='email'
          />

          <label htmlFor='password' className='mt-3 mb-1'>Password</label>
          <input
            className='outline-none mb-3 border px-2 py-0.5 rounded'
            value={form.password}
            onChange={handleForm}
            type='password'
            id='password'
            placeholder='Enter your password'
            name='password'
          />

          <Button type='submit' className='bg-amber-500 text-white mt-5' name='Signup' />
        </form>
      </div>
    </div>
  )
}
