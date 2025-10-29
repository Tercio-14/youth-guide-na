/**
 * Demo Profile Page
 * Mock profile for UI/UX testing
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const DemoProfile = () => {
  const navigate = useNavigate();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile saved! (demo mode)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-yellow-100 border-b border-yellow-300 py-2 text-center">
        <p className="text-sm font-medium text-yellow-900">
          🧪 <strong>Demo Mode</strong> - No real data saved
        </p>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/demo/chat")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Chat
        </Button>

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Alex" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Demo" />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="demo@youthguide.na" />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="+264 81 234 5678" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age Bracket</Label>
                <select id="age" className="w-full border rounded-md p-2">
                  <option>18-20</option>
                  <option>21-25</option>
                  <option>26-30</option>
                </select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue="Windhoek" />
              </div>
            </div>

            <div>
              <Label htmlFor="education">Education Level</Label>
              <select id="education" className="w-full border rounded-md p-2">
                <option>Grade 12</option>
                <option>Certificate</option>
                <option>Diploma</option>
                <option>Degree</option>
              </select>
            </div>

            <div>
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Input id="skills" defaultValue="Communication, Computer Literacy, Teamwork" />
            </div>

            <div>
              <Label htmlFor="interests">Interests (comma separated)</Label>
              <Input id="interests" defaultValue="Technology, Business, Education" />
            </div>

            <Button type="submit" className="w-full">
              Save Profile (Demo)
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DemoProfile;
