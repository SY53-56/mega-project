import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({children, authentication = true}) {
    const [loader, setloader] = useState(true)
    const {}= useSelector()
    const navigate = useNavigate()

    const authStatus = useSelector(state=>state.auth.status)
    useEffect(()=>{
if(authentication && authStatus !==authentication){
  navigate("/login")
}else if(!authentication && authStatus !== authentication){
    navigate("/")

}
setloader(false)
    },[authStatus,navigate,authentication])
  return (
    <div>AuthLayout</div>
  )
}
