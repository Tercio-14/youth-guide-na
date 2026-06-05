/**
 * Demo/Test Mode Configuration
 * 
 * This file contains configuration for the offline demo mode.
 * It provides mock API utilities that work without authentication.
 */

// Demo API base URL
export const DEMO_API_URL = '/api/demo';

// Mock API utilities for demo mode
export const demoApi = {
  // Auth
  login: async (email: string, password: string) => {
    await delay(500);
    return {
      success: true,
      user: {
        uid: 'demo-user-123',
        email: email || 'demo@youthguide.na',
        displayName: 'Demo User'
      },
      token: 'demo-token-12345'
    };
  },

  // Chat
  sendMessage: async (message: string, conversationId?: string) => {
    const response = await fetch(`${DEMO_API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationId })
    });
    return response.json();
  },

  getConversation: async (conversationId: string) => {
    const response = await fetch(`${DEMO_API_URL}/chat/conversation/${conversationId}`);
    return response.json();
  },

  getRecentConversations: async (limit = 5) => {
    const response = await fetch(`${DEMO_API_URL}/chat/conversations/recent?limit=${limit}`);
    return response.json();
  },

  // Profile
  getProfile: async () => {
    const response = await fetch(`${DEMO_API_URL}/users/profile`);
    return response.json();
  },

  updateProfile: async (profile: Record<string, unknown>) => {
    const response = await fetch(`${DEMO_API_URL}/users/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    return response.json();
  },

  // Opportunities
  getOpportunities: async (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${DEMO_API_URL}/opportunities?${params}`);
    return response.json();
  },

  // Saved
  getSaved: async () => {
    const response = await fetch(`${DEMO_API_URL}/saved`);
    return response.json();
  },

  saveOpportunity: async (opportunityId: string) => {
    const response = await fetch(`${DEMO_API_URL}/saved/${opportunityId}`, {
      method: 'POST'
    });
    return response.json();
  },

  unsaveOpportunity: async (opportunityId: string) => {
    const response = await fetch(`${DEMO_API_URL}/saved/${opportunityId}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // Feedback
  submitFeedback: async (feedback: Record<string, unknown>) => {
    const response = await fetch(`${DEMO_API_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback)
    });
    return response.json();
  }
};

// Helper function to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Demo user context
export const demoUser = {
  uid: 'demo-user-123',
  email: 'demo@youthguide.na',
  displayName: 'Demo User',
  emailVerified: true
};

// Check if we're in demo mode
export const isDemoMode = () => {
  return window.location.pathname.startsWith('/demo');
};
