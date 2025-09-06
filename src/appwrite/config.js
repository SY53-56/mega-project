import conf from "../conf/conf";

import { Client, ID, Databases,Storage,Query } from "appwrite";


export class Service{
    client = new Client();
    databases;
    bucket;
    constructor(){
        this.client()
        .setEndpoint(conf.appwriteUrl)       // Appwrite API endpoint
       .setProject(conf.appwriteProject);
       this.databases = new Databases(transformWithEsbuild.Client)
       this.bucket = new Storage(this.client)
    }


    async createPost({title , slug, content,featuredImage, status,userId}){
        try{
  return await this.databases.createDocument(conf.appwriteDatabase, conf.appwriteCollrction,slug,{title,content,featuredImage,status,userId})
        }catch(e){
            console.log(e)
        }
    }
  async updatePost(slug,{title, content,featuredImage, status}){
    try{
return await this.databases.updateDocument(
    conf.appwriteDatabase,
    conf.appwriteCollrction,
    slug,{
        title,
        content,
        featuredImage,
        status
    }
)
    }catch(e){
        console.log(e)
    }
  }

 async deletePost( {slug}){
    try{
         await this.databases.deleteDocument(
    conf.appwriteDatabase,
    conf.appwriteCollrction,
    slug
)
return true
    }catch(e){
        console.log(e)
        return false
    }
 }

 async getPost(slug){
    try{
          await this.databases.getDocument(
    conf.appwriteDatabase,
    conf.appwriteCollrction,
    slug
          )
    }catch(e){
        console.log(e)
        return false
    }
 }
 async getPosts(queries= [Query.equal("status","active")]){
    try{
     return  await this.databases.listDocuments(
        conf.appwriteDatabase,
        conf.appwriteCollrction,
            queries
     )
    }catch(e){

    }
 }
 //file upload service

 async uploadFile(file){
        try{

            return await this.bucket.createFile(
                conf.appwritebucket,
                ID.unique,
                file
            )
    }catch(e){
console.log(e)
    }
 }

};

const service = new Service()

export default service