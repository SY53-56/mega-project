import React from 'react'

import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
export default function LogoutButton() {
    const dispatch = useDispatch()

    const logotHandler = ()=>{
        authService.logout().then(()=>{
            dispatch(logout())
        })
        
    }
  return (
<button onClick={logotHandler} className='inline-bloack px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>Logout</button>
  )
}
