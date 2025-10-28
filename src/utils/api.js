// API client for YouthGuide NA frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    // OFFLINE MODE: Will be set by useOffline hook
    this.isOfflineMode = false;
  }

  // OFFLINE MODE: Set offline mode status (called from components using useOffline)
  setOfflineMode(isOffline) {
    if (this.isOfflineMode !== isOffline) {
      console.log(`🔄 [API] Mode switched: ${isOffline ? 'OFFLINE' : 'ONLINE'}`);
      this.isOfflineMode = isOffline;
    }
  }

  // OFFLINE MODE: Route endpoint based on mode
  getEndpoint(endpoint) {
    // Normalize endpoint to always start with '/'
    const ep = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // If offline, prefix all non-offline endpoints with /offline
    // Example: '/chat' -> '/offline/chat', '/chats/123' -> '/offline/chats/123'
    if (this.isOfflineMode && !ep.startsWith('/offline')) {
      const offlineEndpoint = `/offline${ep}`;
      console.log(`🔀 [API] Routing to offline: ${ep} → ${offlineEndpoint}`);
      return offlineEndpoint;
    }
    return ep;
  }

  generateRequestId() {
    return Math.random().toString(36).substr(2, 9);
  }

  async request(endpoint, options = {}) {
    const requestId = this.generateRequestId();
    const startTime = Date.now();
    
    // OFFLINE MODE: Route to offline endpoint if in offline mode
    const routedEndpoint = this.getEndpoint(endpoint);
    const url = `${API_BASE_URL}${routedEndpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Debug: Log the final headers
    if (options.method === 'POST') {
      console.log(`🔧 [API-${requestId}] Final headers being sent:`, config.headers);
      console.log(`🔧 [API-${requestId}] Content-Type specifically:`, config.headers['Content-Type']);
    }

    // Log the request start
    console.log(`🔄 [API-${requestId}] ${options.method || 'GET'} ${routedEndpoint} - Starting ${this.isOfflineMode ? '(OFFLINE)' : '(ONLINE)'}`, {
      url,
      method: options.method || 'GET',
      hasAuth: !!config.headers.Authorization,
      hasBody: !!options.body,
      isOffline: this.isOfflineMode,
      timestamp: new Date().toISOString()
    });

    // Log request body (excluding sensitive data)
    if (options.body && options.method !== 'GET') {
      try {
        const bodyData = JSON.parse(options.body);
        const sanitizedBody = { ...bodyData };
        // Remove sensitive fields from logs
        delete sanitizedBody.password;
        delete sanitizedBody.token;
        console.log(`📤 [API-${requestId}] Request body:`, sanitizedBody);
      } catch (e) {
        console.log(`📤 [API-${requestId}] Request body: [Unable to parse]`);
      }
    }

    try {
      const response = await fetch(url, config);
      const duration = Date.now() - startTime;
      
      console.log(`📥 [API-${requestId}] Response received - ${response.status} (${duration}ms)`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        duration: `${duration}ms`,
        contentType: response.headers.get('content-type')
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        
        console.error(`❌ [API-${requestId}] Request failed:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          errorData,
          duration: `${duration}ms`
        });
        
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      
      console.log(`✅ [API-${requestId}] Request completed successfully (${duration}ms)`, {
        dataKeys: responseData ? Object.keys(responseData) : [],
        hasProfile: !!responseData?.profile,
        hasData: !!responseData?.data,
        success: responseData?.success
      });
      
      return responseData;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`💥 [API-${requestId}] Request failed after ${duration}ms:`, {
        endpoint,
        error: error.message,
        name: error.name,
        stack: error.stack?.split('\n')[0] // Just first line of stack
      });
      throw error;
    }
  }

  async post(endpoint, data, token = null) {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers
    });
  }

  async get(endpoint, token = null) {
    return this.request(endpoint, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }

  async put(endpoint, data, token = null) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }

  async delete(endpoint, token = null) {
    return this.request(endpoint, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }

  // Feedback API methods
  async submitFeedback(opportunityId, feedback, conversationId, token) {
    return this.post('/feedback', {
      opportunityId,
      feedback,
      conversationId
    }, token);
  }

  async getOpportunityFeedback(opportunityId, token = null) {
    return this.get(`/feedback/opportunity/${opportunityId}`, token);
  }

  async getUserFeedbackHistory(token) {
    return this.get('/feedback/user', token);
  }

  // Config API methods
  async getDataSource() {
    return this.get('/config/data-source');
  }

  async switchDataSource(source, token) {
    return this.post('/config/data-source', { source }, token);
  }

  async resetDataSource(token) {
    return this.post('/config/reset', {}, token);
  }
}

export const apiClient = new ApiClient();