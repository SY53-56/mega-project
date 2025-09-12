import React, { useEffect,useState } from 'react'
import {  } from 'react'
import { PostForm,Container } from '../components'
import service from '../appwrite/config'
import { useNavigate, useParams } from 'react-router-dom'
export default function EditPost() {
    const [post , setPost]=useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()
    useEffect(()=>{
  if(slug){
    service.getPost(slug).then((post)=>{
        if(post){
            setPost(post)
        }
    })
  }else{
    navigate("/")
  }
    },[slug, navigate])
  return post? (
    <div className='py-8'>
        <Container>
            <PostForm/>
        </Container>
    </div>
  ):null
}
