import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, ArrowLeft, User as UserIcon, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/utils/api";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  const { user, token, userProfile, updateUserProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [ageBracket, setAgeBracket] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  console.log('🏠 [Profile] Component mounted', {
    hasUser: !!user,
    hasToken: !!token,
    hasProfile: !!userProfile,
    userEmail: user?.email,
    timestamp: new Date().toISOString()
  });

  // Load existing profile data if available
  useEffect(() => {
    console.log('🔄 [Profile] useEffect triggered - checking for existing profile', {
      userProfile,
      hasProfile: !!userProfile
    });
    
    if (userProfile) {
      console.log('📋 [Profile] Loading existing profile data', userProfile);
      setFirstName(userProfile.firstName || "");
      setAgeBracket(userProfile.ageBracket || "");
      setSkills(userProfile.skills || []);
      setInterests(userProfile.interests || []);
      setIsEditing(true);
      
      console.log('✅ [Profile] Profile data loaded into form', {
        firstName: userProfile.firstName,
        ageBracket: userProfile.ageBracket,
        skillsCount: userProfile.skills?.length || 0,
        interestsCount: userProfile.interests?.length || 0
      });
    }
  }, [userProfile]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 [Profile] Form submission started', {
      firstName: `"${firstName}" (${typeof firstName}, length: ${firstName?.length})`,
      ageBracket: `"${ageBracket}" (${typeof ageBracket}, length: ${ageBracket?.length})`,
      skills: `${JSON.stringify(skills)} (${typeof skills}, length: ${skills?.length})`,
      interests: `${JSON.stringify(interests)} (${typeof interests}, length: ${interests?.length})`,
      isEditing,
      hasToken: !!token,
      userId: user?.uid
    });
    
    if (!firstName || !ageBracket || skills.length === 0 || interests.length === 0) {
      console.warn('⚠️ [Profile] Form validation failed - missing required fields', {
        hasFirstName: !!firstName,
        hasAgeBracket: !!ageBracket,
        skillsCount: skills.length,
        interestsCount: interests.length
      });
      toast.error("Please complete all sections");
      return;
    }

    if (!token) {
      console.error('❌ [Profile] No authentication token available');
      toast.error("Authentication required. Please log in again.");
      navigate("/auth");
      return;
    }

    setLoading(true);
    console.log('🔄 [Profile] Starting profile save API call...');
    
    try {
      const profileData = {
        firstName: firstName.trim(),
        ageBracket,
        skills,
        interests
      };
      
      console.log('📤 [Profile] Sending profile data to API', {
        ...profileData,
        skillsDetailed: profileData.skills.map((s, i) => `[${i}]: "${s}"`),
        interestsDetailed: profileData.interests.map((s, i) => `[${i}]: "${s}"`)
      });
      
      console.log('🔍 [Profile] Raw profile data for API:', JSON.stringify(profileData, null, 2));

      const response = await apiClient.post('/users/profile', profileData, token);
      
      console.log('✅ [Profile] Profile saved successfully', {
        response,
        isEditing,
        duration: Date.now() - Date.now() // This will show in API client logs
      });

      // Update the auth context with the new profile
      if (response.profile) {
        updateUserProfile(response.profile);
        console.log('🔄 [Profile] Updated auth context with new profile data');
      }

      toast.success(
        isEditing 
          ? `Profile updated successfully, ${firstName}!` 
          : `Welcome, ${firstName}! Let's find opportunities for you.`
      );
      
      console.log('🎯 [Profile] Navigating to chat page');
      navigate("/chat");
      
    } catch (error) {
      console.error('💥 [Profile] Profile save failed', {
        error: error.message,
        stack: error.stack,
        profileData: { firstName, ageBracket, skills, interests },
        hasToken: !!token,
        userId: user?.uid
      });
      
      toast.error(
        error.message || "Failed to save profile. Please try again."
      );
    } finally {
      setLoading(false);
      console.log('🏁 [Profile] Form submission completed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header with Back Button */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border bg-card px-4 py-3 shadow-soft"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/chat")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <UserIcon className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">
              {isEditing ? "Edit Profile" : "Create Profile"}
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </motion.header>

      <div className="mx-auto max-w-2xl p-4 py-8">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 shadow-medium md:p-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Tell Us About You</h2>
              </div>
              <p className="text-muted-foreground">
                This helps us find the best opportunities for you. We only need the basics.
              </p>
            </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="firstName">What's your first name?</Label>
              <Input
                id="firstName"
                placeholder="e.g., Tafeni"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="transition-all duration-200 focus:scale-[1.02]"
              />
              <p className="text-xs text-muted-foreground">
                We'll use this to make conversations feel personal.
              </p>
            </motion.div>

            {/* Age Bracket */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label>How old are you?</Label>
              <div className="grid grid-cols-2 gap-3">
                {["16-20", "21-25", "26-30", "31-35"].map((bracket, index) => (
                  <motion.div
                    key={bracket}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <Button
                      type="button"
                      variant={ageBracket === bracket ? "default" : "outline"}
                      onClick={() => setAgeBracket(bracket)}
                      className="w-full transition-all duration-200 hover:scale-105"
                    >
                      {bracket} years
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <Label>What are your top 3 skills?</Label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SKILLS.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.65 + index * 0.03 }}
                  >
                    <Badge
                      variant={skills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer transition-all duration-200 hover:scale-110"
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                      {skills.includes(skill) && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  </motion.div>
                ))}
              </div>
              
              {/* Display custom skills as removable badges */}
              {skills.filter(skill => !SUGGESTED_SKILLS.includes(skill)).length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Your custom skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {skills
                      .filter(skill => !SUGGESTED_SKILLS.includes(skill))
                      .map((skill) => (
                        <Badge
                          key={skill}
                          variant="default"
                          className="cursor-pointer transition-all duration-200 hover:scale-110"
                          onClick={() => setSkills(skills.filter(s => s !== skill))}
                        >
                          {skill}
                          <X className="ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add your own skill..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
                <Button type="button" variant="outline" onClick={addCustomSkill}>
                  Add
                </Button>
              </div>
              <motion.p 
                className="text-xs text-muted-foreground"
                key={skills.join(",")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Selected: {skills.join(", ") || "None"}
              </motion.p>
            </motion.div>

            {/* Interests */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-2"
            >
              <Label>What interests you most? (Choose up to 3)</Label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_INTERESTS.map((interest, index) => (
                  <motion.div
                    key={interest}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.75 + index * 0.03 }}
                  >
                    <Badge
                      variant={interests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer transition-all duration-200 hover:scale-110"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                      {interests.includes(interest) && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  </motion.div>
                ))}
              </div>
              <motion.p 
                className="text-xs text-muted-foreground"
                key={interests.join(",")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Selected: {interests.join(", ") || "None"}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-gradient-warm" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {isEditing ? "Updating Profile..." : "Saving Profile..."}
                  </span>
                ) : (
                  isEditing ? "Update Profile" : "Start Finding Opportunities"
                )}
              </Button>
            </motion.div>
          </form>
        </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
