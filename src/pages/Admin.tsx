import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

const Admin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    skillsRequired: "",
    cost: "",
    location: "",
    contact: "",
    source: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Save to Firebase and compute embeddings
    toast.success("Opportunity added successfully!");
    
    // Reset form
    setFormData({
      title: "",
      category: "",
      description: "",
      skillsRequired: "",
      cost: "",
      location: "",
      contact: "",
      source: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 shadow-soft">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/chat")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1">Admin Panel</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto max-w-3xl p-4">
        <Card className="p-6 shadow-medium">
          <div className="mb-6">
            <h2 className="mb-2 text-xl font-bold">Add New Opportunity</h2>
            <p className="text-sm text-muted-foreground">
              Add verified opportunities from trusted sources. These will be searchable by users.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Plumbing Apprenticeship"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  placeholder="job/training/education/volunteer"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Short description of the opportunity"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="skillsRequired">Skills Required</Label>
                <Input
                  id="skillsRequired"
                  placeholder="Comma-separated: plumbing, basic math"
                  value={formData.skillsRequired}
                  onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Cost *</Label>
                <Input
                  id="cost"
                  placeholder="free/paid/N$100"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Havana, Windhoek"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact *</Label>
                <Input
                  id="contact"
                  placeholder="Phone/email/link"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source Organization *</Label>
              <Input
                id="source"
                placeholder="e.g., City Youth Desk, NUST Outreach"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-warm">
              <Plus className="mr-2 h-4 w-4" /> Add Opportunity
            </Button>
          </form>
        </Card>

        <Card className="mt-4 p-4 shadow-soft">
          <h3 className="mb-2 font-semibold">TODO: Backend Integration</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Save opportunity to Firestore</li>
            <li>• Compute embedding using sentence-transformers</li>
            <li>• Store embedding vector in Firestore</li>
            <li>• Add bulk import from JSON/CSV</li>
            <li>• Add edit/delete functionality</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
