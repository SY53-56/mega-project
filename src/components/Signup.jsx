import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { login } from '../store/authSlice'
import {Button , Input,Logo  } from "./index"
import { Link , useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

export default function Signup() {
    const [error,setError] = useState("")
    const dispatch  = useDispatch()
    const navigate = useNavigate()
    const {register ,handleSubmit} = useForm()

    const create = async (data) => {
  try {
    await authService.createAccount(data); // signup + auto-login
    const currentUser = await authService.getCurrentUser();
    if (currentUser) {
      dispatch(login(currentUser));
      navigate("/");
    } else {
      setError("Unable to get logged-in user. Check your session or cookies.");
    }
  } catch (e) {
    console.error("Signup error:", e);
    setError(e.message);
  }
};

  return (
   <div className='flex items-center justify-center '>
    <div className={`mx-auto w-full p-10 border border-black/10`}>
       <div className='mb-2 flex justify-center '>
        <span className='inline-block w-full max-w-[100px]'>
          <Logo width='100%'/>
        </span>
       </div>
        <h2 className='text-center text-2xl font-bold leading-tight'>Sign in to your account</h2>
                       <p className='mt-2 text-center text-base text-black/60'>
                           Don&apos;t have any account?&nbsp; <Link to={'/login'} className='font-medium text-primary transition-all duration-200 hover:underline'>Sign Up</Link>
       
       </p>
       {error && <p className="text-red-500 m"> {error}</p>}


       <form  onSubmit={handleSubmit(create)}>
<div className='space-y-5'>
    <Input
     label="full name:"
     type="text"
     placeholder="Enter your name"
     {...register("name",{
      required:true
     })}
    />
     <Input label="Email"
          placeholder="Enter your email"
          type="email"
          {...register("email",{required:true,
            validate:{matchPatern:(value)=>
                /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(value) || "Email address must be valid "
            }
          })}
        />
        <Input
        label="password"
        type="password"
        placeholder="Enter your password"
        {...register("password",{required:true})}
        />
        <Button type="submit"> create account</Button>
</div>
       </form>
        </div>


   </div>
  )
}
