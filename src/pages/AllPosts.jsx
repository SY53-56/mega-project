import React, { useEffect, useState } from 'react'
import service from '../appwrite/config'
import { PostCard , Container} from '../components'
export default function AllPosts() {
    const [post,setPost] = useState([])
    useEffect(()=>{

    })
    service.getPosts([]).then((res)=>{
if(res){
    setPost(res.documents)
}
    }).catch((e)=>{

    })
  return (
    <div className='w-full py-8'>
        <Container>
            <div className='flex flex-wrap'>
                

                {post.map((post)=>(
                    <div key={post.$id}>
<PostCard {...post}/>
                    </div>
                ))}
            </div>
                    </Container>
    </div>
  )
}
