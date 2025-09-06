import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)       // Appwrite API endpoint
      .setProject(conf.appwriteProject);   // Project ID

    this.account = new Account(this.client); // Account helper
  }

  // Create new account + auto login
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        // Auto login after signup
        return await this.login({ email, password });
      }
      return userAccount;
    } catch (error) {
      console.error("Create account error:", error);
      throw error;
    }
  }

  // Login with email + password
  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Get currently logged-in user
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("Get current user error:", error);
      return null; // null if no session
    }
  }

  // Logout (delete all sessions)
  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
}

// Create a single shared instance
const authService = new AuthService();

export default authService;
