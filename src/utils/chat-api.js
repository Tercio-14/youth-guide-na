/**
 * OFFLINE MODE: Chat API Wrapper
 * 
 * Provides unified chat API that automatically routes to offline/online endpoints
 * based on network status. Makes it transparent to the Chat component.
 */

import { apiClient } from './api';

/**
 * Send a chat message (automatically routes based on offline/online mode)
 * 
 * @param {string} message - User's message
 * @param {string} conversationId - Conversation ID
 * @param {boolean} isOffline - Whether in offline mode
 * @returns {Promise<Object>} Chat response with opportunities
 */
export async function sendChatMessage(message, conversationId, isOffline = false) {
  console.log(`💬 [Chat API] Sending message (${isOffline ? 'OFFLINE' : 'ONLINE'} mode)`);
  
  // Set offline mode in API client
  apiClient.setOfflineMode(isOffline);
  
  try {
    // The apiClient will automatically route to /api/offline/chat if offline
    const response = await apiClient.post('/chat', {
      message,
      conversationId
    });
    
    console.log(`✅ [Chat API] Received response:`, {
      hasResponse: !!response.response,
      opportunityCount: response.opportunities?.length || 0,
      isOffline: response.isOffline || response.offlineSimulation || false,
      intent: response.intent
    });
    
    return response;
  } catch (error) {
    console.error('❌ [Chat API] Failed to send message:', error);
    throw error;
  }
}

/**
 * Get conversation history (automatically routes based on offline/online mode)
 * 
 * @param {string} conversationId - Conversation ID
 * @param {boolean} isOffline - Whether in offline mode
 * @returns {Promise<Object>} Conversation data
 */
export async function getConversation(conversationId, isOffline = false) {
  apiClient.setOfflineMode(isOffline);
  
  try {
    if (isOffline) {
      // Offline: GET /api/offline/chats/:id
      const response = await apiClient.get(`/chats/${conversationId}`);
      return response.conversation;
    } else {
      // Online: GET /api/chat/conversation/:id
      const response = await apiClient.get(`/chat/conversation/${conversationId}`);
      return response;
    }
  } catch (error) {
    console.error('❌ [Chat API] Failed to get conversation:', error);
    throw error;
  }
}

/**
 * Get all conversations (automatically routes based on offline/online mode)
 * 
 * @param {boolean} isOffline - Whether in offline mode
 * @returns {Promise<Array>} List of conversations
 */
export async function getAllConversations(isOffline = false) {
  apiClient.setOfflineMode(isOffline);
  
  try {
    if (isOffline) {
      // Offline: GET /api/offline/chats
      const response = await apiClient.get('/chats');
      return response.conversations || [];
    } else {
      // Online: GET /api/chat/conversations/recent?limit=5
      const response = await apiClient.get('/chat/conversations/recent?limit=5');
      return response.conversations || [];
    }
  } catch (error) {
    console.error('❌ [Chat API] Failed to get conversations:', error);
    throw error;
  }
}

/**
 * Create new conversation (automatically routes based on offline/online mode)
 * 
 * @param {string} title - Conversation title
 * @param {boolean} isOffline - Whether in offline mode
 * @returns {Promise<Object>} New conversation data
 */
export async function createConversation(title, isOffline = false) {
  apiClient.setOfflineMode(isOffline);
  
  try {
    if (isOffline) {
      // Offline: POST /api/offline/chats/new
      const response = await apiClient.post('/chats/new', { title });
      return response.conversation;
    } else {
      // Online: POST /api/chat/new
      const response = await apiClient.post('/chat/new', { title });
      return response.conversation;
    }
  } catch (error) {
    console.error('❌ [Chat API] Failed to create conversation:', error);
    throw error;
  }
}

/**
 * Delete conversation (automatically routes based on offline/online mode)
 * 
 * @param {string} conversationId - Conversation ID
 * @param {boolean} isOffline - Whether in offline mode
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteConversation(conversationId, isOffline = false) {
  apiClient.setOfflineMode(isOffline);
  
  try {
    if (isOffline) {
      // Offline: DELETE /api/offline/chats/:id
      return await apiClient.delete(`/chats/${conversationId}`);
    } else {
      // Online: DELETE /api/chat/:id
      return await apiClient.delete(`/chat/${conversationId}`);
    }
  } catch (error) {
    console.error('❌ [Chat API] Failed to delete conversation:', error);
    throw error;
  }
}

/**
 * Save opportunity (automatically routes based on offline/online mode)
 * 
 * @param {Object} opportunity - Opportunity to save
 * @param {boolean} isOffline - Whether in offline mode
 * @returns {Promise<Object>} Save result
 */
export async function saveOpportunity(opportunity, isOffline = false) {
  apiClient.setOfflineMode(isOffline);
  
  try {
    if (isOffline) {
      // Offline: POST /api/offline/saved
      return await apiClient.post('/saved', { opportunity });
    } else {
      // Online: POST /api/saved (or Firebase)
      // TODO: Implement online save endpoint
      console.warn('⚠️ [Chat API] Online save not implemented yet');
      return { success: false, message: 'Online save not implemented' };
    }
  } catch (error) {
    console.error('❌ [Chat API] Failed to save opportunity:', error);
    throw error;
  }
}

export default {
  sendChatMessage,
  getConversation,
  getAllConversations,
  createConversation,
  deleteConversation,
  saveOpportunity
};
