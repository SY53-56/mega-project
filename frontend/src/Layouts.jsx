import React from 'react'
import Header from './component/Header'
import { Outlet } from 'react-router-dom'
import Footer from './component/Footer'

export default function Layouts() {
    
  return (
<>
<Header />
<main className='w-full min-h-screen'>
    <Outlet/>
</main>
<Footer/>
</>
  )
}
