import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, ArrowLeft, User as UserIcon, Sparkles, WifiOff, Cloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useOffline, isNetworkError } from "@/contexts/OfflineContext";
import { apiClient } from "@/utils/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { speakPageWelcome } from "@/utils/tts";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const { isOffline, offlineUser, updateOfflineUser, forceOfflineMode } = useOffline();
  const [firstName, setFirstName] = useState("");
  const [ageBracket, setAgeBracket] = useState("");
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
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
    isOffline,
    hasOfflineUser: !!offlineUser,
    timestamp: new Date().toISOString()
  });

  // Load existing profile data if available
  useEffect(() => {
    console.log('🔄 [Profile] useEffect triggered - checking for existing profile', {
      userProfile,
      hasProfile: !!userProfile,
      isOffline,
      offlineUser
    });
    
    // Speak welcome message after a short delay
    setTimeout(() => {
      speakPageWelcome('profileWelcome');
    }, 1000);

    // Use offline user data when offline, otherwise use userProfile
    const profileToLoad = isOffline ? offlineUser : userProfile;

    if (profileToLoad) {
      console.log('📋 [Profile] Loading existing profile data', {
        source: isOffline ? 'offline' : 'online',
        profileToLoad
      });
      setFirstName(profileToLoad.firstName || "");
      setAgeBracket(profileToLoad.ageBracket || "");
      setLocation(profileToLoad.location || "");
      setEducation(profileToLoad.education || "");
      setEmploymentStatus(profileToLoad.employmentStatus || "");
      setSkills(profileToLoad.skills || []);
      setInterests(profileToLoad.interests || []);
      setIsEditing(true);
      
      console.log('✅ [Profile] Profile data loaded into form', {
        firstName: profileToLoad.firstName,
        ageBracket: profileToLoad.ageBracket,
        skillsCount: profileToLoad.skills?.length || 0,
        interestsCount: profileToLoad.interests?.length || 0,
        source: isOffline ? 'offline storage' : 'online API'
      });
    }
  }, [userProfile, isOffline, offlineUser]);

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
      location: `"${location}" (${typeof location}, length: ${location?.length})`,
      education: `"${education}" (${typeof education}, length: ${education?.length})`,
      employmentStatus: `"${employmentStatus}" (${typeof employmentStatus}, length: ${employmentStatus?.length})`,
      skills: `${JSON.stringify(skills)} (${typeof skills}, length: ${skills?.length})`,
      interests: `${JSON.stringify(interests)} (${typeof interests}, length: ${interests?.length})`,
      isEditing,
      isOffline,
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

    if (!token && !isOffline) {
      console.error('❌ [Profile] No authentication token available');
      toast.error("Authentication required. Please log in again.");
      navigate("/auth");
      return;
    }

    setLoading(true);
    console.log('🔄 [Profile] Starting profile save...', { isOffline });
    
    try {
      const profileData = {
        firstName: firstName.trim(),
        ageBracket,
        location: location.trim(),
        education,
        employmentStatus,
        skills,
        interests
      };
      
      console.log('📤 [Profile] Prepared profile data', {
        ...profileData,
        mode: isOffline ? 'offline' : 'online'
      });

      if (isOffline) {
        // Save to offline storage
        console.log('📴 [Profile] Saving to offline storage');
        await updateOfflineUser(profileData);
        
        toast.success(
          `✅ Profile saved offline! Changes will sync when you're back online.`
        );
        
        console.log('✅ [Profile] Offline profile saved successfully');
      } else {
        // Save to online API
        console.log('🌐 [Profile] Sending profile data to API');
        const response = await apiClient.post('/users/profile', profileData, token);
        
        console.log('✅ [Profile] Profile saved successfully', { response });

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
      }
      
      console.log('🎯 [Profile] Navigating to chat page');
      navigate("/chat");
      
    } catch (error) {
      console.error('💥 [Profile] Profile save failed', {
        error: error.message,
        stack: error.stack,
        profileData: { firstName, ageBracket, skills, interests },
        isOffline,
        hasToken: !!token,
        userId: user?.uid
      });
      
      // Check if it's a Firebase/network error - switch to offline mode
      if (!isOffline && isNetworkError(error)) {
        console.log('🔌 [Profile] Network error detected, forcing offline mode');
        forceOfflineMode();
        toast.info('📴 Switched to offline mode. Please try saving again.');
        return;
      }
      
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
        {/* Offline Mode Alert */}
        {isOffline && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <Alert variant="warning">
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium">You're editing your profile offline</p>
                <p className="text-sm mt-1">
                  Your changes will be saved locally and synced when you're back online.
                </p>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

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

            {/* Location */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="location">Where do you live? (Town/City)</Label>
              <Input
                id="location"
                placeholder="e.g., Windhoek, Walvis Bay"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="transition-all duration-200 focus:scale-[1.02]"
              />
              <p className="text-xs text-muted-foreground">
                Helps us find opportunities near you.
              </p>
            </motion.div>

            {/* Education Level */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="space-y-2"
            >
              <Label htmlFor="education">Highest Education Level</Label>
              <Select value={education} onValueChange={setEducation}>
                <SelectTrigger id="education" className="transition-all duration-200 focus:scale-[1.02]">
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Grade 10">Grade 10</SelectItem>
                  <SelectItem value="Grade 12">Grade 12</SelectItem>
                  <SelectItem value="Vocational">Vocational</SelectItem>
                  <SelectItem value="Tertiary">Tertiary</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Helps match you with suitable training programs.
              </p>
            </motion.div>

            {/* Employment Status */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <Label htmlFor="employmentStatus">Current Employment or Study Status</Label>
              <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                <SelectTrigger id="employmentStatus" className="transition-all duration-200 focus:scale-[1.02]">
                  <SelectValue placeholder="Select your status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unemployed">Unemployed</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Studying">Studying</SelectItem>
                  <SelectItem value="Full-time job">Full-time job</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Helps recommend flexible or full-time opportunities.
              </p>
            </motion.div>

            {/* Skills */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
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
              transition={{ delay: 0.75 }}
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
                    {isOffline 
                      ? "Saving Offline..." 
                      : isEditing 
                        ? "Updating Profile..." 
                        : "Saving Profile..."}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {isOffline && <WifiOff className="h-4 w-4" />}
                    {isOffline 
                      ? "Save Profile (Offline)" 
                      : isEditing 
                        ? "Update Profile" 
                        : "Start Finding Opportunities"}
                  </span>
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
