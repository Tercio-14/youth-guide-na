/**
 * Demo Saved Page
 * Mock saved opportunities for UI/UX testing
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Bookmark, ExternalLink, MapPin, Building2 } from "lucide-react";
import { useEffect } from "react";
import { speakPageWelcome } from "@/utils/tts";
import { ThemeToggle } from "@/components/ThemeToggle";

const mockSavedOpportunities = [
  {
    id: "demo-opp-1",
    title: "Junior Developer Internship",
    type: "Internship",
    organization: "TechHub Namibia",
    location: "Windhoek",
    description: "Learn software development with experienced mentors.",
    savedAt: "2025-10-25"
  },
  {
    id: "demo-opp-2",
    title: "Digital Marketing Training",
    type: "Training",
    organization: "Youth Empowerment Centre",
    location: "Windhoek",
    description: "Free 6-week training program in social media marketing.",
    savedAt: "2025-10-24"
  }
];

const DemoSaved = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const messageKey = mockSavedOpportunities.length > 0 ? 'demoSavedWelcome' : 'savedEmpty';
      speakPageWelcome(messageKey);
    }, 1000);
  }, []);

  const handleUnsave = (id: string) => {
    toast.success("Removed from saved (demo mode)");
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="bg-yellow-100 dark:bg-yellow-900/30 border-b border-yellow-300 dark:border-yellow-700 py-2 text-center">
        <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
          🧪 <strong>Demo Mode</strong> - Mock saved opportunities
        </p>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/demo/chat")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chat
          </Button>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Bookmark className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Saved Opportunities</h1>
        </div>

        {mockSavedOpportunities.length === 0 ? (
          <Card className="p-12 text-center">
            <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No saved opportunities yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start exploring and save opportunities you're interested in!
            </p>
            <Button onClick={() => navigate("/demo/chat")}>
              Explore Opportunities
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {mockSavedOpportunities.map((opp) => (
          <Card key={opp.id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {opp.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {opp.type}
                      </span>
                      <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full border border-border flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {opp.location}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleUnsave(opp.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Bookmark className="h-5 w-5 fill-current" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Building2 className="h-4 w-4" />
                  <span>{opp.organization}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{opp.description}</p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("View details (demo mode)")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Apply (demo mode)")}
                  >
                    Apply Now
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  Saved on {opp.savedAt}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoSaved;
