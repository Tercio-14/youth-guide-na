import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MOCK_SAVED = [
  {
    id: "1",
    title: "Plumbing Apprenticeship",
    category: "Training",
    cost: "Free",
    source: "City Youth Desk",
    contact: "081234567",
    location: "Havana, Windhoek",
    savedAt: new Date("2025-01-10"),
  },
  {
    id: "2",
    title: "Part-time Security Guard",
    category: "Job",
    cost: "N$50/day",
    source: "Local Business",
    contact: "security@example.com",
    location: "Katutura",
    savedAt: new Date("2025-01-09"),
  },
];

const Saved = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 shadow-soft">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/chat")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Saved Opportunities</h1>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto max-w-3xl p-4">
        {MOCK_SAVED.length === 0 ? (
          <Card className="p-8 text-center shadow-soft">
            <p className="text-muted-foreground">
              You haven't saved any opportunities yet. Start chatting to find some!
            </p>
            <Button className="mt-4 bg-gradient-warm" onClick={() => navigate("/chat")}>
              Go to Chat
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {MOCK_SAVED.map((item) => (
              <Card key={item.id} className="p-4 shadow-soft">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{item.cost}</Badge>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                  </div>
                </div>

                <div className="mb-3 space-y-1 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Source:</span> {item.source}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> {item.location}
                  </p>
                  <p>
                    <span className="font-medium">Contact:</span> {item.contact}
                  </p>
                  <p className="text-xs">
                    Saved {item.savedAt.toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="mr-1 h-3 w-3" /> Share
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
