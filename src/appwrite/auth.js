import conf from '../conf/conf.js';
import { Client, Account, ID } from 'appwrite';

export class AuthService {
  client = new Client();
  account;

  constructor() {
    // Set Appwrite endpoint and project ID
    this.client
      .setEndpoint(conf.appwriteUrl)       // e.g., https://fra.cloud.appwrite.io/v1
      .setProject(conf.appwriteProject);   // your actual Project ID

    this.account = new Account(this.client);
  }

  // Create a new account and auto-login
  async createAccount({ email, password, name }) {
    try {
      // Create a user in Appwrite
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      // If creation succeeds, auto-login
      if (userAccount) {
        return this.login({ email, password });
      }
      return userAccount;
    } catch (error) {
      console.error('Create account error:', error);
      throw error;
    }
  }

  // Login with email + password
  async login({ email, password }) {
    try {
      return await this.account.createEmailSession(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Get the currently logged-in user
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      // 401 → no session / not logged in
      // 404 → project ID or endpoint incorrect
      if (error.code === 401 || error.code === 404) return null;
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Logout (delete all sessions)
  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

// Singleton instance
const authService = new AuthService();

export default authService;
