/**
 * Demo Profile Page
 * Mock profile for UI/UX testing
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { speakPageWelcome } from "@/utils/tts";
import { ThemeToggle } from "@/components/ThemeToggle";

const DemoProfile = () => {
  const navigate = useNavigate();
  const [ageBracket, setAgeBracket] = useState("18-20");
  const [education, setEducation] = useState("Grade 12");

  useEffect(() => {
    setTimeout(() => {
      speakPageWelcome('demoProfileWelcome');
    }, 1000);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile saved! (demo mode)");
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="bg-yellow-100 dark:bg-yellow-900/30 border-b border-yellow-300 dark:border-yellow-700 py-2 text-center">
        <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
          🧪 <strong>Demo Mode</strong> - No real data saved
        </p>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
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
                <Select value={ageBracket} onValueChange={setAgeBracket}>
                  <SelectTrigger id="age">
                    <SelectValue placeholder="Select age bracket" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-20">18-20</SelectItem>
                    <SelectItem value="21-25">21-25</SelectItem>
                    <SelectItem value="26-30">26-30</SelectItem>
                    <SelectItem value="31-35">31-35</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue="Windhoek" />
              </div>
            </div>

            <div>
              <Label htmlFor="education">Education Level</Label>
              <Select value={education} onValueChange={setEducation}>
                <SelectTrigger id="education">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Grade 10">Grade 10</SelectItem>
                  <SelectItem value="Grade 12">Grade 12</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="Degree">Degree</SelectItem>
                </SelectContent>
              </Select>
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
