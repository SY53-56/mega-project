import React, { useEffect, useState } from 'react'
import service from '../appwrite/config'
import { PostCard, Container } from '../components'
export default function  () {
const [posts , setPosts] = useState([])

  useEffect(()=>{
 service.getPost().then((post)=>{
  if(post){
    setPosts(posts.documents)
  }
 })
  })
 if(posts.length=== 0  ){
  return(
    <div className='w-full py-8 mt-4 text-center'>
<Container>
  <div className='flex flex-wrap'> 
    <div className='p-2 w-full'>
      <h1 className='text-2xl font-bold hover:text-gray-500'>Login to read posts </h1>
    </div>
  </div>
</Container>
    </div>
  )
 }else{
  return(
    <div className='w-full py-8'>
     <Container>
       <div className='flex flex-wrap'>
        {posts.map((post)=>(
          <div key={post.$id} className='p-2 w-1/4'>
            <PostCard post={post}/>
          </div>
        ))}
      </div>
     </Container>
    </div>
  )
 }
}
