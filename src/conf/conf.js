const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
        appwriteProject: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
            appwriteDatabase: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
            appwriteCollrction:String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
                       appwritebucket:String(import.meta.env.VITE_APPWRITE_BUCKET_ID)
}



export default conf