// Debug utility for YouthGuide NA frontend
// Available in browser console as window.YGDebug

class YouthGuideDebug {
  constructor() {
    this.logHistory = [];
    this.startTime = Date.now();
    
    // Capture console logs for debugging
    this.originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info
    };
    
    console.log('🔧 YouthGuide Debug Utility Loaded');
  }

  // Show current auth state
  getAuthState() {
    const authContext = window.YGAuthState || {};
    console.log('🔐 Current Auth State:', {
      hasUser: !!authContext.user,
      hasToken: !!authContext.token,
      hasProfile: !!authContext.userProfile,
      userEmail: authContext.user?.email,
      profileName: authContext.userProfile?.firstName,
      loading: authContext.loading
    });
    return authContext;
  }

  // Show current API configuration
  getAPIConfig() {
    const config = {
      apiUrl: import.meta.env.VITE_API_URL,
      mode: import.meta.env.MODE,
      isDev: import.meta.env.DEV
    };
    console.log('🌐 API Configuration:', config);
    return config;
  }

  // Test API connectivity
  async testAPI() {
    console.log('🧪 Testing API connectivity...');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}/health`);
      const data = await response.json();
      
      console.log('✅ Backend Health Check:', {
        status: response.status,
        healthy: data.status === 'healthy',
        data
      });
      
      return { healthy: true, data };
    } catch (error) {
      console.error('❌ Backend Health Check Failed:', error);
      return { healthy: false, error: error.message };
    }
  }

  // Test profile data submission
  async testProfileSubmission() {
    console.log('🧪 Testing profile data submission...');
    
    const authState = window.YGAuthState;
    console.log('🔑 Auth state:', { hasToken: !!authState?.token, tokenStart: authState?.token?.substring(0, 20) });
    
    if (!authState?.token) {
      console.error('❌ No authentication token available');
      return { success: false, error: 'No auth token' };
    }

    const testData = {
      firstName: 'Test User',
      ageBracket: '21-25',
      skills: ['Testing', 'Debugging'],
      interests: ['Technology', 'Learning']
    };

    console.log('📤 Sending test data:', testData);
    console.log('📤 JSON stringified:', JSON.stringify(testData));
    console.log('📤 API URL:', `${import.meta.env.VITE_API_URL}/users/debug-profile`);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      };
      
      console.log('📤 Request headers:', headers);
      
      const requestBody = JSON.stringify(testData);
      console.log('📤 Request body string:', requestBody);
      console.log('📤 Request body length:', requestBody.length);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/debug-profile`, {
        method: 'POST',
        headers: headers,
        body: requestBody
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);
      console.log('📊 Response headers:', Object.fromEntries(response.headers));

      const result = await response.json();
      
      console.log('📊 Debug Profile Test Result:', {
        status: response.status,
        success: response.ok,
        sentData: testData,
        receivedData: result,
        backendReceivedBody: result.receivedBody
      });
      
      console.log('🔍 Backend received data breakdown:');
      console.log('   firstName:', result.receivedBody?.firstName);
      console.log('   ageBracket:', result.receivedBody?.ageBracket);  
      console.log('   skills:', result.receivedBody?.skills);
      console.log('   interests:', result.receivedBody?.interests);
      
      return { success: true, result };

    } catch (error) {
      console.error('💥 Profile submission test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Show environment info
  getEnvironment() {
    const env = {
      userAgent: navigator.userAgent,
      url: window.location.href,
      localStorage: Object.keys(localStorage),
      sessionStorage: Object.keys(sessionStorage),
      cookies: document.cookie ? document.cookie.split(';').length : 0,
      online: navigator.onLine,
      language: navigator.language,
      platform: navigator.platform
    };
    
    console.log('💻 Environment Info:', env);
    return env;
  }

  // Show recent logs (last 50)
  getRecentLogs() {
    console.log('📋 Recent Application Logs (filtered for YouthGuide):');
    // This would need to be enhanced to actually capture logs
    console.log('Note: Check browser console for detailed logs with prefixes like [API], [Profile], [Chat], [Auth]');
  }

  // Clear all application data
  clearAppData() {
    console.log('🧹 Clearing all application data...');
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ Application data cleared. Refresh to restart fresh.');
  }

  // Show help
  help() {
    console.log(`
🔧 YouthGuide Debug Utility Commands:

🔐 Authentication:
  YGDebug.getAuthState()     - Show current user/auth state
  
🌐 API & Backend:  
  YGDebug.getAPIConfig()           - Show API configuration
  YGDebug.testAPI()                - Test backend connectivity
  YGDebug.testProfileSubmission()  - Test profile data submission
  
📊 Debugging:
  YGDebug.getEnvironment()   - Show browser/environment info
  YGDebug.getRecentLogs()    - Show recent application logs
  YGDebug.clearAppData()     - Clear localStorage/sessionStorage
  
💡 Tips:
  - All app actions are logged with prefixes like [API-123], [Profile], etc.
  - Check Network tab for API calls
  - Use browser's Application tab to inspect localStorage
    `);
  }
}

// Make debug utility available globally
window.YGDebug = new YouthGuideDebug();

// Show help on load
console.log('Type YGDebug.help() for debug commands');

export default YouthGuideDebug;