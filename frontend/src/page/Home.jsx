import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function Home() {
    const {token}= useSelector(state=>state.auth)
    const dispitch =useDispatch()
  return (
    <>
    <h1 className='text-9xl bg-amber-600'>sahul yadav</h1>
    </>
  )
}
