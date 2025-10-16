import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SUGGESTED_SKILLS = [
  "Plumbing", "Electrician", "Carpentry", "Painting", "Cooking",
  "Cleaning", "Childcare", "Driving", "Security", "IT/Computer",
  "Sales", "Customer Service", "Gardening", "Sewing"
];

const SUGGESTED_INTERESTS = [
  "Earn Money", "Free Training", "Short Courses", "Work Near Me",
  "Online Learning", "Part-time Jobs", "Apprenticeships", "Volunteering"
];

const Profile = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [ageBracket, setAgeBracket] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else if (skills.length < 3) {
      setSkills([...skills, skill]);
    } else {
      toast.error("You can select up to 3 skills");
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else if (interests.length < 3) {
      setInterests([...interests, interest]);
    } else {
      toast.error("You can select up to 3 interests");
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim()) && skills.length < 3) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !ageBracket || skills.length === 0 || interests.length === 0) {
      toast.error("Please complete all sections");
      return;
    }

    // TODO: Save profile to Firebase
    toast.success(`Welcome, ${firstName}! Let's find opportunities for you.`);
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Card className="p-6 shadow-medium md:p-8">
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold">Tell Us About You</h1>
            <p className="text-muted-foreground">
              This helps us find the best opportunities for you. We only need the basics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">What's your first name?</Label>
              <Input
                id="firstName"
                placeholder="e.g., Tafeni"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                We'll use this to make conversations feel personal.
              </p>
            </div>

            {/* Age Bracket */}
            <div className="space-y-2">
              <Label>How old are you?</Label>
              <div className="grid grid-cols-2 gap-3">
                {["16-20", "21-25", "26-30", "31-35"].map((bracket) => (
                  <Button
                    key={bracket}
                    type="button"
                    variant={ageBracket === bracket ? "default" : "outline"}
                    onClick={() => setAgeBracket(bracket)}
                  >
                    {bracket} years
                  </Button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label>What are your top 3 skills?</Label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SKILLS.map((skill) => (
                  <Badge
                    key={skill}
                    variant={skills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                    {skills.includes(skill) && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add your own skill..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
                />
                <Button type="button" variant="outline" onClick={addCustomSkill}>
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Selected: {skills.join(", ") || "None"}
              </p>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <Label>What interests you most? (Choose up to 3)</Label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_INTERESTS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                    {interests.includes(interest) && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Selected: {interests.join(", ") || "None"}
              </p>
            </div>

            <Button type="submit" className="w-full bg-gradient-warm" size="lg">
              Start Finding Opportunities
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
