import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    // ✅ don’t call client like a function
    this.client
      .setEndpoint(conf.appwriteUrl) // Appwrite API endpoint
      .setProject(conf.appwriteProject);

    // ✅ pass client instance, not “transformWithEsbuild.Client”
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  // ----------------- Posts -----------------
  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabase,
        conf.appwriteCollrction,
        slug,
        { title, content, featuredImage, status, userId }
      );
    } catch (e) {
      console.log("createPost error", e);
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabase,
        conf.appwriteCollrction,
        slug,
        { title, content, featuredImage, status }
      );
    } catch (e) {
      console.log("updatePost error", e);
    }
  }

  async deletePost({ slug }) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabase,
        conf.appwriteCollrction,
        slug
      );
      return true;
    } catch (e) {
      console.log("deletePost error", e);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabase,
        conf.appwriteCollrction,
        slug
      );
    } catch (e) {
      console.log("getPost error", e);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabase,
        conf.appwriteCollrction,
        queries
      );
    } catch (e) {
      console.log("getPosts error", e);
    }
  }

  // ----------------- Files -----------------
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwritebucket,
        ID.unique(), // ✅ call ID.unique()
        file
      );
    } catch (e) {
      console.log("uploadFile error", e);
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwritebucket, fileId);
      return true;
    } catch (error) {
      console.log("deleteFile error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(conf.appwritebucket, fileId);
  }
}

const service = new Service();
export default service;
