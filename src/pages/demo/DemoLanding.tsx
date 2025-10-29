/**
 * Demo Landing Page
 * Offline-capable version for UI/UX testing
 */

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Briefcase, BookOpen, Award, ArrowRight, Users, TrendingUp, Shield } from "lucide-react";

const DemoLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Banner */}
      <div className="bg-yellow-100 border-b border-yellow-300 py-2 text-center">
        <p className="text-sm font-medium text-yellow-900">
          🧪 <strong>Demo Mode</strong> - Offline UI/UX Testing | No authentication required
        </p>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">YouthGuide NA</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connecting Namibian youth to opportunities through AI-powered assistance
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/demo/auth')}
            >
              Start Demo <ArrowRight className="ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => navigate('/demo/chat')}
            >
              Try Chat Now
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Chat Assistant</h3>
            <p className="text-gray-600 text-sm">
              Chat with our intelligent assistant to find opportunities tailored to you
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Job Opportunities</h3>
            <p className="text-gray-600 text-sm">
              Discover jobs, internships, and employment opportunities across Namibia
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Training Programs</h3>
            <p className="text-gray-600 text-sm">
              Find training courses, workshops, and skill development programs
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Scholarships</h3>
            <p className="text-gray-600 text-sm">
              Explore bursaries, scholarships, and financial aid opportunities
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-blue-600 mr-2" />
                <div className="text-4xl font-bold text-gray-900">1,250+</div>
              </div>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-8 h-8 text-green-600 mr-2" />
                <div className="text-4xl font-bold text-gray-900">487+</div>
              </div>
              <p className="text-gray-600">Opportunities</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-8 h-8 text-purple-600 mr-2" />
                <div className="text-4xl font-bold text-gray-900">93%</div>
              </div>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to discover your opportunities?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of young Namibians finding their path to success
          </p>
          <Button 
            size="lg" 
            className="text-lg px-12 py-6"
            onClick={() => navigate('/demo/auth')}
          >
            Get Started Now <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 YouthGuide NA | Demo Mode - UI/UX Testing Only
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DemoLanding;
