/**
 * Demo Landing Page
 * Offline-capable version for UI/UX testing
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Briefcase, BookOpen, Award, ArrowRight, Users, TrendingUp, Shield } from "lucide-react";
import { useEffect } from "react";
import { speakPageWelcome } from "@/utils/tts";
import { ThemeToggle } from "@/components/ThemeToggle";

const DemoLanding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      speakPageWelcome('demoLandingWelcome');
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Banner */}
      <div className="bg-yellow-100 dark:bg-yellow-900/30 border-b border-yellow-300 dark:border-yellow-700 py-2 flex items-center justify-between px-4">
        <div></div>
        <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
          🧪 <strong>Demo Mode</strong> - Offline UI/UX Testing | No authentication required
        </p>
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to <span className="bg-gradient-warm bg-clip-text text-transparent">YouthGuide NA</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
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
          <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Chat Assistant</h3>
            <p className="text-muted-foreground text-sm">
              Chat with our intelligent assistant to find opportunities tailored to you
            </p>
          </Card>

          <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Job Opportunities</h3>
            <p className="text-muted-foreground text-sm">
              Discover jobs, internships, and employment opportunities across Namibia
            </p>
          </Card>

          <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Training Programs</h3>
            <p className="text-muted-foreground text-sm">
              Find training courses, workshops, and skill development programs
            </p>
          </Card>

          <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Scholarships</h3>
            <p className="text-muted-foreground text-sm">
              Explore bursaries, scholarships, and financial aid opportunities
            </p>
          </Card>
        </div>

        {/* Stats Section */}
        <Card className="mt-16 shadow-medium p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-primary mr-2" />
                <div className="text-4xl font-bold text-foreground">1,250+</div>
              </div>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mr-2" />
                <div className="text-4xl font-bold text-foreground">487+</div>
              </div>
              <p className="text-muted-foreground">Opportunities</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-2" />
                <div className="text-4xl font-bold text-foreground">93%</div>
              </div>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to discover your opportunities?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of young Namibians finding their path to success
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-warm text-lg px-12 py-6 shadow-medium"
            onClick={() => navigate('/demo/auth')}
          >
            Get Started Now <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 YouthGuide NA | Demo Mode - UI/UX Testing Only
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DemoLanding;
